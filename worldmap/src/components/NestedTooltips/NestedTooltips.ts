import * as d3 from 'd3';
import {
    MOUSELEAVE_TOOLTIP_DELAY,
    MOUSEMOVE_TOOLTIP_DELAY,
    TOOLTIP_BACKGROUND_FILL,
    TOOLTIP_BACKGROUND_OPACITY,
    TOOLTIP_BACKGROUND_STROKE,
    TOOLTIP_BACKGROUND_STROKE_WIDTH,
    TOOLTIP_BORDER_RADIUS,
    TOOLTIP_FILL_COLOR,
    TOOLTIP_PADDING,
    TOOLTIP_TEXT_SIZE
} from "../../utils/constants";
import {IKeyWord} from "../../types/KeyWord";
import {IFeature} from "../../types/Feature";
import * as FeatureApi from "../../api/featureApi";
import * as AdditionalInfoApi from "../../api/additionalInfoApi";
import {getKeyWord} from "../../utils/getKeyWord";
import {IAdditionalData} from "../../types/AdditionalData";

export const NestedTooltips = ()  => {

    let tooltipTimeout: any;

    /**
     * Adds a tooltip with the provided text at the specified coordinates.
     * @param parentGroup - The parent group element to append the tooltip to.
     * @param x - The x-coordinate for the tooltip.
     * @param y - The y-coordinate for the tooltip.
     * @param text - The text content of the tooltip.
     * @param additionalClass - Additional class for customization.
     * @param mouseMoveHandler - Mouse move event handler for the tooltip.
     */
    const addTooltipText = (parentGroup: any, x: number, y: number, text: string, additionalClass: string, mouseMoveHandler: (event: any) => void) => {
        return parentGroup.append("text")
            .attr("class", `tooltip-text ${additionalClass}`)
            .attr("x", x)
            .attr("y", y)
            .style("font-size", `${TOOLTIP_TEXT_SIZE}px`)
            .style("fill", TOOLTIP_FILL_COLOR)
            .style("visibility", "hidden")
            .text(text)
            .on("mousemove", mouseMoveHandler);
    };

    /**
     * Adds a tooltip with the given data.
     * @param parentGroup - The parent group element to append the tooltip to.
     * @param event - The mouse event triggering the tooltip.
     * @param d - The feature data for which to display the tooltip.
     */
    const addKeyWordTooltip = async (parentGroup: any, event: any, d: IKeyWord) => {
        const [x, y] = d3.pointer(event); // Get mouse pointer position

        // Add background rectangle for tooltip
        const tooltipNestedParent = parentGroup.append("g")
            .attr("class", "tooltip-nested-parent");
        const rect = tooltipNestedParent.append("rect")
            .attr("class", "tooltip-rect")
            .attr("x", x + TOOLTIP_PADDING)
            .attr("y", y - 20 - TOOLTIP_PADDING)
            .style("fill", TOOLTIP_BACKGROUND_FILL)
            .style("stroke", TOOLTIP_BACKGROUND_STROKE)
            .style("stroke-width", TOOLTIP_BACKGROUND_STROKE_WIDTH)
            .style("opacity", TOOLTIP_BACKGROUND_OPACITY)
            .style("rx", TOOLTIP_BORDER_RADIUS)
            .style("visibility", "hidden")
            .on("mousemove", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));

        // Add text elements for the tooltip
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 2, y - TOOLTIP_PADDING, d.name, "tooltip-bold", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 2, y + 20, d.description, "tooltip-tag", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));

        let textWidth = Math.max(d.name.length * 8, d.description.length * 7);

        rect.style("visibility", "visible")
            .attr("width", textWidth + (TOOLTIP_PADDING * 2))
            .attr("height", 20 + (TOOLTIP_PADDING * 4));
        tooltipNestedParent.selectAll("text").style("visibility", "visible");
    };

    /**
     * Adds a tooltip with neighbors information.
     * @param parentGroup - The parent group element to append the tooltip to.
     * @param event - The mouse event triggering the tooltip.
     * @param d - The feature data for which to display the tooltip.
     */
    const addNeighborsTooltip = async (parentGroup: any, event: any, d: IFeature) => {
        if (!d) return;

        parentGroup.style("cursor", "default");
        const [x, y] = d3.pointer(event); // Get mouse pointer position
        const dataMapData = await FeatureApi.getById(d.id); // Fetch data for the feature
        const neighbors = dataMapData.neighbors;

        // Add background rectangle for tooltip
        const tooltipNestedParent = parentGroup.append("g")
            .attr("class", "tooltip-nested-parent");
        const rect = tooltipNestedParent.append("rect")
            .attr("class", "tooltip-rect")
            .attr("x", x + TOOLTIP_PADDING)
            .attr("y", y - 20 - TOOLTIP_PADDING)
            .style("fill", TOOLTIP_BACKGROUND_FILL)
            .style("stroke", TOOLTIP_BACKGROUND_STROKE)
            .style("stroke-width", TOOLTIP_BACKGROUND_STROKE_WIDTH)
            .style("opacity", TOOLTIP_BACKGROUND_OPACITY)
            .style("rx", TOOLTIP_BORDER_RADIUS)
            .style("visibility", "hidden")
            .on("mousemove", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));

        // Add text elements for the tooltip
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 2, y - TOOLTIP_PADDING, "Neighbors:", "tooltip-bold", (event: any) => handleTooltipMouseMoveWithKeyword(event, tooltipNestedParent, "neighbors"));

        let textWidth = "Neighbors:".length * 8;

        FeatureApi.fetchMultipleByIds(neighbors).then(neighborsData => {
            neighborsData.forEach((neighbor: any, index: number) => {
                    if (neighbor.name) {
                        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 3, y + (20 * (index + 1)), neighbor.name, "tooltip-tag tooltip-underline", (event: any) => handleTooltipMouseMoveWithFeature(event, tooltipNestedParent, neighbor));
                        textWidth = Math.max(textWidth, neighbor.name.length * 8);
                    }

                    if (index === neighbors.length - 1) {
                        rect.style("visibility", "visible")
                            .attr("width", textWidth + (TOOLTIP_PADDING * 2))
                            .attr("height", 20 * (neighbors.length + 1) + (TOOLTIP_PADDING * 4));
                        tooltipNestedParent.selectAll("text").style("visibility", "visible");
                    }
            });
        });

        if (!neighbors.length) {
            rect.style("visibility", "visible")
                .attr("width", textWidth + (TOOLTIP_PADDING * 2))
                .attr("height", (TOOLTIP_PADDING * 3));
            tooltipNestedParent.selectAll("text").style("visibility", "visible");
        }
    };

    /**
     * Adds a tooltip to the map for the given feature.
     * @param parentGroup - The parent group element to append the tooltip to.
     * @param event - The mouse event triggering the tooltip.
     * @param d - The feature data for which to display the tooltip.
     */
    const addTooltip = async (parentGroup: any, event: any, d: IFeature) => {
        if (!d) return;

        parentGroup.style("cursor", "default");
        const [x, y] = d3.pointer(event); // Get mouse pointer position
        const additionalData: IAdditionalData = await AdditionalInfoApi.getById(d.id); // Fetch data for the feature
        const neighbors = d.neighbors;

        // Add background rectangle for tooltip
        const tooltipNestedParent = parentGroup.append("g")
            .attr("class", "tooltip-nested-parent");
        const rect = tooltipNestedParent.append("rect")
            .attr("class", "tooltip-rect")
            .attr("x", x + TOOLTIP_PADDING)
            .attr("y", y - 20 - TOOLTIP_PADDING)
            .style("fill", TOOLTIP_BACKGROUND_FILL)
            .style("stroke", TOOLTIP_BACKGROUND_STROKE)
            .style("stroke-width", TOOLTIP_BACKGROUND_STROKE_WIDTH)
            .style("opacity", TOOLTIP_BACKGROUND_OPACITY)
            .style("rx", TOOLTIP_BORDER_RADIUS)
            .style("visibility", "hidden")
            .on("mousemove", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));


        const tooltipName = d.name;
        const tooltipNeighbors = `${neighbors.length}`;
        const tooltipArea = `${additionalData.area} km2`;
        const tooltipPopulation = `${additionalData.population}`;
        const tooltipCapital = `${additionalData.capital}`;

        // Add text elements for the tooltip
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 2, y - TOOLTIP_PADDING, "Name:", "tooltip-bold", (event: any) => handleTooltipMouseMoveWithKeyword(event, tooltipNestedParent, "name"));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 3, y + TOOLTIP_PADDING * 0.5, tooltipName, "", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 2, y + TOOLTIP_PADDING * 2.5, "Neighbors:", "tooltip-bold", (event: any) => handleTooltipMouseMoveWithKeyword(event, tooltipNestedParent, "neighbors"));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 3, y + TOOLTIP_PADDING * 4, tooltipNeighbors, "tooltip-underline", (event: any) => handleTooltipMouseMoveWithNeighbors(event, tooltipNestedParent, d));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 2, y + TOOLTIP_PADDING * 6, "Area:", "tooltip-bold", (event: any) => handleTooltipMouseMoveWithKeyword(event, tooltipNestedParent, "area"));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 3, y + TOOLTIP_PADDING * 7.5, tooltipArea, "", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 2, y + TOOLTIP_PADDING * 9.5, "Population:", "tooltip-bold", (event: any) => handleTooltipMouseMoveWithKeyword(event, tooltipNestedParent, "population"));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 3, y + TOOLTIP_PADDING * 11, tooltipPopulation, "", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 2, y + TOOLTIP_PADDING * 13, "Capital:", "tooltip-bold", (event: any) => handleTooltipMouseMoveWithKeyword(event, tooltipNestedParent, "capital"));
        addTooltipText(tooltipNestedParent, x + TOOLTIP_PADDING * 3, y + TOOLTIP_PADDING * 14.5, tooltipCapital, "", (event: any) => handleTooltipMouseMove(event, tooltipNestedParent));

        const textWidth = Math.max(tooltipName.length * 8, tooltipNeighbors.length * 8, tooltipArea.length * 8, tooltipPopulation.length * 8, tooltipCapital.length * 8, 20 * 8);

        rect.style("visibility", "visible")
            .attr("width", textWidth + (TOOLTIP_PADDING * 2))
            .attr("height", 20 * 6 + (TOOLTIP_PADDING * 6.5));
        tooltipNestedParent.selectAll("text").style("visibility", "visible");
    };


    /**
     * Handles mouse move events for tooltips.
     * @param event - The mouse event triggering the tooltip.
     * @param tooltipNestedParent - The parent group element of the tooltip.
     */
    const handleTooltipMouseMove = (event: any, tooltipNestedParent: any) => {
        tooltipNestedParent.style("cursor", "default");
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltipNestedParent.selectAll(".tooltip-nested-parent").remove();
        }, MOUSEMOVE_TOOLTIP_DELAY);
    };

    /**
     * Handles mouse move events for tooltips with keyword information.
     * @param event - The mouse event triggering the tooltip.
     * @param tooltipNestedParent - The parent group element of the tooltip.
     * @param keyword - The keyword to display in the tooltip.
     */
    const handleTooltipMouseMoveWithKeyword = (event: any, tooltipNestedParent: any, keyword: string) => {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltipNestedParent.selectAll(".tooltip-nested-parent").remove();
            addKeyWordTooltip(tooltipNestedParent, event, getKeyWord(keyword) as IKeyWord);
        }, MOUSEMOVE_TOOLTIP_DELAY);
    };

    /**
     * Handles mouse move events for tooltips with feature information.
     * @param event - The mouse event triggering the tooltip.
     * @param tooltipNestedParent - The parent group element of the tooltip.
     * @param data - The feature data to display in the tooltip.
     */
    const handleTooltipMouseMoveWithFeature = (event: any, tooltipNestedParent: any, data: IFeature) => {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltipNestedParent.selectAll(".tooltip-nested-parent").remove();
            addTooltip(tooltipNestedParent, event, data);
        }, MOUSEMOVE_TOOLTIP_DELAY);
    };

    /**
     * Handles mouse move events for tooltips neighbors information.
     * @param event - The mouse event triggering the tooltip.
     * @param tooltipNestedParent - The parent group element of the tooltip.
     * @param data - The feature data to display in the tooltip.
     */
    const handleTooltipMouseMoveWithNeighbors = (event: any, tooltipNestedParent: any, data: IFeature) => {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            tooltipNestedParent.selectAll(".tooltip-nested-parent").remove();
            addNeighborsTooltip(tooltipNestedParent, event, data);
        }, MOUSEMOVE_TOOLTIP_DELAY);
    };

    /**
     * Handles mouse out event for tooltip root.
     * @param event - The mouse event triggering the mouse out.
     */
    const handleTooltipMouseOutRoot = (event: any, svg: any) => {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            svg.selectAll(".tooltip-root").remove();
        }, MOUSELEAVE_TOOLTIP_DELAY);
    };

    /**
     * Handles mouse leave event for tooltip root.
     * @param event - The mouse event triggering the mouse leave.
     */
    const handleTooltipMouseLeaveRoot = (event: any, svg: any) => {
        handleTooltipMouseOutRoot(event, svg);
    };

    /**
     * Handles mouse move event for displaying tooltip root.
     * @param event - The mouse event triggering the tooltip.
     * @param d - The feature data associated with the path.
     */
    const handleTooltipMouseMoveRoot = (event: any, d: IFeature, svg: any) => {
        clearTimeout(tooltipTimeout); // Prevent tooltip from closing
        tooltipTimeout = setTimeout(() => {
            svg.selectAll(".tooltip-root").remove();
            const tooltipRoot = svg.append("g")
                .attr("class", "tooltip-root")
                .on("mouseout", (event: any) => handleTooltipMouseOutRoot(event, svg))
                .on("mouseleave", (event: any) => handleTooltipMouseLeaveRoot(event, svg));
            addTooltip(tooltipRoot, event, d);
        }, MOUSEMOVE_TOOLTIP_DELAY);
    };

    /**
     * Handles mouse move event for displaying tooltip root.
     * @param event - The mouse event triggering the tooltip.
     * @param d - The feature data associated with the path.
     */
    const tooltipRemoveAll = (event: any, svg: any) => {
        svg.selectAll(".tooltip-root").remove();
    };

    return {
        handleTooltipMouseLeaveRoot,
        handleTooltipMouseMoveRoot,
        tooltipRemoveAll
    };
}
export default NestedTooltips;

