import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { GeoPath, GeoPermissibleObjects } from 'd3';
import FOR_VIEW from '../api/FOR_VIEW.json';

interface Feature {
    type: string;
    geometry: any;
    id: string;
    neighbors: string[];
    name: string;
}
const D3Map = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Create a lookup map from the namesAndIds data
        const dataMap = FOR_VIEW.features.reduce((acc: Record<string, Feature>, { type, name, geometry, id, neighbors }: Feature) => {
            acc[id] = { id, name, neighbors, type, geometry};
            return acc;
        }, {});

        let tooltipTimeout: any; // To store the timeout ID
        let tooltipElements: any[] = []; // Store tooltip elements for removal

        const removeTooltip = () => {
            tooltipElements.forEach(element => element.remove());
            tooltipElements = [];
            clearTimeout(tooltipTimeout);
        };

        const removeOneTooltip = (id: string) => {
            const tooltipGroup = svg.select(`.tooltip-${id}`);
            if (tooltipGroup) {
                // Find the index of the tooltip element from the end of the array
                const index = tooltipElements
                    .map(element => element.attr("class"))
                    .lastIndexOf(`tooltip-${id}`);
                if (index !== -1) {
                    // Iterate over the elements to remove them from the DOM
                    for (let i = tooltipElements.length - 1; i >= index; i--) {
                        tooltipElements[i].remove();
                    }
                    // Remove the elements from the array
                    tooltipElements.splice(index, tooltipElements.length - index);
                }
            }
        }

        const addTooltip = (parentGroup: any, event: any, d: Feature) => {
            // Show tooltip for country name
            if (!d) {
                return;
            }
            const [x, y] = d3.pointer(event);
            const dataMapData = dataMap[d.id];
            const padding = 10;
            const name = dataMapData.name;
            const neighbors = dataMapData.neighbors;

            const text = name.length >= neighbors.toString().length ? `${name}` : `${neighbors.toString()}`;
            const textWidth = (text.length * 8); // Estimate text width
            const textHeight = 20 * neighbors.length;

            // Add background rectangle for country name tooltip
            const tooltipNestedParent = parentGroup.append("g")
                .attr("class", `tooltip-nested-parent`);
            tooltipNestedParent.append("rect")
                .attr("class", `tooltip-rect`)
                .attr("x", x + padding)
                .attr("y", y - 20 - padding)
                .attr("width", textWidth + (padding * 2))
                .attr("height", textHeight + (padding * 4))
                .style("fill", "white")
                .style("stroke", "#666")
                .style("stroke-width", 1)
                .style("opacity", 0.9)
                .style("rx", 5);

            // Add text for country name
            tooltipNestedParent.append("text")
                .attr("class", "tooltip-text")
                .attr("x", x + padding * 2)
                .attr("y", y - padding)
                .style("font-size", "14px")
                .style("fill", "black")
                .text(`${name}`)
                .style("pointer-events", "none");

            Object.values(neighbors).forEach((neighbor, index) => {
                if (dataMap[neighbor]) {
                    tooltipNestedParent.append("text")
                        .attr("class", `tooltip-tag`)
                        .attr("x", x + padding * 2)
                        .attr("y", y + (padding * (index + 1)))
                        .style("font-size", "14px")
                        .style("fill", "black")
                        .text(`${dataMap[neighbor].name}`)
                        .on("mousemove", function (event: any) {
                            clearTimeout(tooltipTimeout); // Prevent tooltip from closing
                            tooltipTimeout = setTimeout(() => {
                                tooltipNestedParent.selectAll(".tooltip-nested-parent").remove();
                                addTooltip(tooltipNestedParent, event, dataMap[neighbor]);
                            }, 1000);
                        });
                } else {
                    console.error(neighbor);
                }
            });

        };

        const svg = d3.select(svgRef.current);
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Map and projection
        const projection = d3.geoNaturalEarth1()
            .scale(width / 5.2)  // Adjust scale to fit the initial view slightly zoomed out
            .translate([width / 2, height / 2]);

        const path: GeoPath<any, GeoPermissibleObjects> = d3.geoPath().projection(projection);

        // Remove any existing paths before appending new ones
        svg.selectAll('path').remove();

        // Append a new group element to hold the map
        const mapGroup = svg.append("g");

        mapGroup.selectAll("path")
            .data(FOR_VIEW.features)
            .enter().append("path")
            .attr("fill", "#69b3a2")
            .attr("d", path as any)  // Type assertion to handle the typing issue
            .style("stroke", "#fff")
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
                            }, 500);
                        })
                        .on("mouseleave", function (event: any) {
                            clearTimeout(tooltipTimeout);
                            tooltipTimeout = setTimeout(() => {
                                tooltipRoot.remove();
                                svg.selectAll(".tooltip-root").remove();
                            }, 500);
                        });
                    addTooltip(tooltipRoot, event, d);
                }, 1000);
            });
    }, []);

    return (
        <svg ref={svgRef} style={{ width: '100vw', height: '100vh' }}></svg>
    );
};

export default D3Map;

