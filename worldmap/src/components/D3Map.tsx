import React, {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import {GeoPath, GeoPermissibleObjects, zoom} from 'd3';
import {
    COUNTRY_FILL_COLOR, COUNTRY_STROKE_COLOR, WINDOW_SCALE_FACTOR
} from "../utils/constants";
import useFetchFeatureData from "../hooks/useFetchFeatureData";
import {NestedTooltips} from "./NestedTooltips/NestedTooltips";
import {IFeature} from "../types/Feature";

const D3Map = () => {
    // Custom hook to fetch data
    const {data, loading, error} = useFetchFeatureData();
    // Reference to the SVG element
    const svgRef = useRef<SVGSVGElement | null>(null);
    const nestedTooltips = NestedTooltips();

    useEffect(() => {
        // Return if data is still loading or there is an error
        if (loading || error) return;

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
            .on("mousemove", function (event, d: IFeature) {
                nestedTooltips.handleTooltipMouseMoveRoot(event, d, svg);
            })
            .on("mouseleave", function (event: any) {
                nestedTooltips.handleTooltipMouseLeaveRoot(event, svg);
            });

        // Initialize zoom behavior
        const zoomBehavior: any = zoom()
            .scaleExtent([1, 8]) // Set the zoom scale limits
            .translateExtent([[0, 0], [width, height]]) // Restrict translation within the viewport
            .on('zoom', (event: any) => {
                mapGroup.attr('transform', event.transform); // Apply zoom transformation to the map group
                nestedTooltips.tooltipRemoveAll(event, svg);
            });

        // Apply zoom behavior to the SVG element
        svg.call(zoomBehavior);
    }, [data, loading, error, nestedTooltips]);

    // Display loading or error message if necessary
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <svg ref={svgRef} style={{width: '100vw', height: '100vh'}}></svg>
    );
};

export default D3Map;
