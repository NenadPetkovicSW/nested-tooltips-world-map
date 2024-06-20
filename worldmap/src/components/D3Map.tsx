import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import {GeoPath, GeoPermissibleObjects, zoom} from 'd3';
import {getById} from "../api/api";
import {
    COUNTRY_FILL_COLOR, COUNTRY_STROKE_COLOR, MOUSELEAVE_TOOLTIP_DELAY,
    MOUSEMOVE_TOOLTIP_DELAY,
    TOOLTIP_BACKGROUND_FILL, TOOLTIP_BACKGROUND_OPACITY,
    TOOLTIP_BACKGROUND_STROKE,
    TOOLTIP_BACKGROUND_STROKE_WIDTH, TOOLTIP_BORDER_RADIUS, TOOLTIP_FILL_COLOR, TOOLTIP_FONT_WEIGHT,
    TOOLTIP_PADDING, TOOLTIP_TEXT_SIZE, WINDOW_SCALE_FACTOR
} from "../utils/constants";
import {Feature} from "../types/Feature";
import useFetchData from "../hooks/useFetchData";

const D3Map = () => {
    // Custom hook to fetch data
    const { data, loading, error } = useFetchData();
    // Reference to the SVG element
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Return if data is still loading or there is an error
        if (loading || error) return;

        let tooltipTimeout: any;

        /**
         * Adds a tooltip to the map for the given feature.
         * @param parentGroup - The parent group element to append the tooltip to.
         * @param event - The mouse event triggering the tooltip.
         * @param d - The feature data for which to display the tooltip.
         */
        const addTooltip = async (parentGroup: any, event: any, d: Feature) => {
            if (!d) {
                return;
            }
            parentGroup.style("cursor", "default")
            const [x, y] = d3.pointer(event); // Get mouse pointer position
            const dataMapData = await getById(d.id); // Fetch data for the feature
            const name = dataMapData.name;
            const neighbors = dataMapData.neighbors;

            // Add background rectangle for country name tooltip
            const tooltipNestedParent = parentGroup.append("g")
                .attr("class", `tooltip-nested-parent`);
            const rect = tooltipNestedParent.append("rect")
                .attr("class", `tooltip-rect`)
                .attr("x", x + TOOLTIP_PADDING)
                .attr("y", y - 20 - TOOLTIP_PADDING)
                .style("fill", TOOLTIP_BACKGROUND_FILL)
                .style("stroke", TOOLTIP_BACKGROUND_STROKE)
                .style("stroke-width", TOOLTIP_BACKGROUND_STROKE_WIDTH)
                .style("opacity", TOOLTIP_BACKGROUND_OPACITY)
                .style("rx", TOOLTIP_BORDER_RADIUS)
                .style("visibility", "hidden")
                .on("mousemove", function (event: any) {
                    tooltipNestedParent.style("cursor", "default")
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = setTimeout(() => {
                        tooltipNestedParent.selectAll(".tooltip-nested-parent").remove();
                    }, MOUSEMOVE_TOOLTIP_DELAY);
                });

            // Add text for country name
            tooltipNestedParent.append("text")
                .attr("class", "tooltip-text")
                .attr("x", x + TOOLTIP_PADDING * 2)
                .attr("y", y - TOOLTIP_PADDING)
                .style("font-size", `${TOOLTIP_TEXT_SIZE}px`)
                .style("font-weight", TOOLTIP_FONT_WEIGHT)
                .style("fill", TOOLTIP_FILL_COLOR)
                .style("visibility", "hidden")
                .text(`${name}`)
                .on("mousemove", function (event: any) {
                    tooltipNestedParent.style("cursor", "default")
                    clearTimeout(tooltipTimeout);
                    tooltipTimeout = setTimeout(() => {
                        tooltipNestedParent.selectAll(".tooltip-nested-parent").remove();
                    }, MOUSEMOVE_TOOLTIP_DELAY);
                });

            let textWidth = name.length * 8; // Initial text width based on country name
            Object.values(neighbors).forEach((neighbor, index) => {
                if (typeof neighbor === "string") {
                    getById(neighbor).then((data) => {
                        if (data) {
                            tooltipNestedParent.append("text")
                                .attr("class", `tooltip-tag`)
                                .attr("x", x + TOOLTIP_PADDING * 2)
                                .attr("y", y + (20 * (index + 1)))
                                .style("font-size", `${TOOLTIP_TEXT_SIZE}px`)
                                .style("fill", TOOLTIP_FILL_COLOR)
                                .style("visibility", "hidden")
                                .text(`${data.name}`)
                                .on("mousemove", function (event: any) {
                                    clearTimeout(tooltipTimeout);
                                    tooltipTimeout = setTimeout(() => {
                                        tooltipNestedParent.selectAll(".tooltip-nested-parent").remove();
                                        addTooltip(tooltipNestedParent, event, data);
                                    }, MOUSEMOVE_TOOLTIP_DELAY);
                                });
                            const neighborTextWidth = data.name.length * 8;
                            if (neighborTextWidth > textWidth) {
                                textWidth = neighborTextWidth;
                            }
                            if (index === neighbors.length - 1) {
                                rect.style("visibility", "visible")
                                    .attr("width", textWidth + (TOOLTIP_PADDING * 2))
                                    .attr("height", 20 * neighbors.length + (TOOLTIP_PADDING * 4));
                                tooltipNestedParent.selectAll("text").style("visibility", "visible");
                            }
                        }
                    });
                }
            });

            if (!neighbors.length) {
                rect.style("visibility", "visible")
                    .attr("width", textWidth + (TOOLTIP_PADDING * 2))
                    .attr("height", (TOOLTIP_PADDING * 3));
                tooltipNestedParent.selectAll("text").style("visibility", "visible");
            }
        };

        // Select the SVG element and set its dimensions
        const svg = d3.select(svgRef.current);
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Define the map projection
        const projection = d3.geoNaturalEarth1()
            .scale(width / WINDOW_SCALE_FACTOR)
            .translate([width / 2, height / 2]);

        const path: GeoPath<any, GeoPermissibleObjects> = d3.geoPath().projection(projection);

        // Remove any existing paths and groups before appending new ones
        svg.selectAll('path').remove();
        svg.selectAll('g').remove();

        // Append a new group element to hold the map
        const mapGroup = svg.append("g");

        // Append paths for each country
        mapGroup.selectAll("path")
            .data(data)
            .enter().append("path")
            .attr("fill", COUNTRY_FILL_COLOR)
            .attr("d", path as any)  // Type assertion to handle the typing issue
            .style("stroke", COUNTRY_STROKE_COLOR)
            .on("mousemove", function (event, d: Feature) {
                clearTimeout(tooltipTimeout); // Prevent tooltip from closing
                tooltipTimeout = setTimeout(() => {
                    svg.selectAll(".tooltip-root").remove();
                    const tooltipRoot = svg.append("g")
                        .attr("class", `tooltip-root`)
                        .on("mouseout", function (event: any) {
                            clearTimeout(tooltipTimeout);
                            tooltipTimeout = setTimeout(() => {
                                tooltipRoot.remove();
                                svg.selectAll(".tooltip-root").remove();
                            }, MOUSELEAVE_TOOLTIP_DELAY);
                        })
                        .on("mouseleave", function (event: any) {
                            clearTimeout(tooltipTimeout);
                            tooltipTimeout = setTimeout(() => {
                                tooltipRoot.remove();
                                svg.selectAll(".tooltip-root").remove();
                            }, MOUSELEAVE_TOOLTIP_DELAY);
                        });
                    addTooltip(tooltipRoot, event, d);
                }, MOUSEMOVE_TOOLTIP_DELAY);
            })
            .on("mouseleave", function (event: any) {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = setTimeout(() => {
                    svg.selectAll(".tooltip-root").remove();
                }, MOUSELEAVE_TOOLTIP_DELAY);
            });

        // Initialize zoom behavior
        const zoomBehavior: any = zoom()
            .scaleExtent([1, 8]) // Set the zoom scale limits
            .translateExtent([[0, 0], [width, height]]) // Restrict translation within the viewport
            .on('zoom', (event: any) => {
                mapGroup.attr('transform', event.transform); // Apply zoom transformation to the map group
                svg.selectAll(".tooltip-root").remove(); // Remove tooltips on zoom
            });

        // Apply zoom behavior to the SVG element
        svg.call(zoomBehavior);
    }, [data, loading, error]);

    // Display loading or error message if necessary
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <svg ref={svgRef} style={{width: '100vw', height: '100vh'}}></svg>
    );
};

export default D3Map;
