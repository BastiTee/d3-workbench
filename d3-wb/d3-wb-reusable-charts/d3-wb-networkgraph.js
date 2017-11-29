function wbNetworkDiagram() {
    "use strict";

    var width = 500
    var height = 500

    var linkStroke = "black"
    var nodeStroke = "black"
    var nodeStrokeWidth = 1
    var legendColor = "black"

    var thicknessRange = [1, 10]
    var radiusRange = [5, 20]

    var legend;
    var legendShiftX = 0;
    var legendShiftY = 0;

    var collide = 0.5

    var colors = d3.scaleOrdinal(["red", "green", "blue"])

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            // ----------------------------------------------------------------
            // SCALES
            // ----------------------------------------------------------------

            var radius = d3.scaleLinear().domain(
                d3.extent(data.nodes, function(d) {
                    return d.weight
                })).range(radiusRange)


            var scaleThickness =
                d3.scaleLinear().domain(d3.extent(data.links, function(d) {
                    return d.value
                })).range(thicknessRange)

            // ----------------------------------------------------------------
            // DATA DEFINITION
            // ----------------------------------------------------------------

            data.nodes.forEach(function(d) {
                d.r = radius(d.weight);
            })

            var link = s.append("g")
                .selectAll("line")
                .data(data.links)
                .enter().append("line")
                .attr("class", "lines")
                .attr("stroke-width", function(d) {
                    return scaleThickness(d.value)
                })
                .style("stroke", linkStroke)
                .style("stroke-opacity", "0.6")

            var node = s.append("g")
                .selectAll("circle")
                .data(data.nodes)
                .enter().append("circle")
                .attr("class", "circles")
                .attr("r", function(d) {
                    return d.r
                })
                .attr("fill", function(d) {
                    return colors(d.group);
                })
                .style("stroke", nodeStroke)
                .style("stroke-width", nodeStrokeWidth)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            // ----------------------------------------------------------------
            // SIMULATION DEFINITION
            // ----------------------------------------------------------------

            var simulation = d3.forceSimulation()
                .force("x", d3.forceX(width))
                .force("y", d3.forceY(height))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("charge", d3.forceManyBody())
                .force("collide", d3.forceCollide().radius(function(d) {
                    return d.r + collide;
                }).iterations(3))
                .force("link", d3.forceLink().id(function(d) {
                    return d.id;
                }))

            simulation
                .nodes(data.nodes)
                .on("tick", ticked);
            simulation.force("link")
                .links(data.links);

            // ----------------------------------------------------------------
            // SIMULATION HELPERS
            // ----------------------------------------------------------------

            function ticked() {
                node.attr("cx", function(d) {
                        return d.x = Math.max(d.r, Math.min(width - d.r, d.x));
                    })
                    .attr("cy", function(d) {
                        return d.y = Math.max(d.r, Math.min(height - d.r, d.y));
                    });
                link.attr("x1", function(d) {
                        return d.source.x;
                    })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.5).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            // ----------------------------------------------------------------
            // LEGEND DEFINITION
            // ----------------------------------------------------------------

            if (legend === undefined) {
                var arr = []
                data.nodes.forEach(function(d) {
                    arr.push(d.group)
                })
                var set = Array.from(new Set(arr.sort()))
                legend = []
                for (var i in set) {
                    legend.push([set[i], colors(set[i])])
                }
            }

            var legendG = s.append("g")
                .attr("font-size", "75%")
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(legend)
                .enter().append("g")
                .attr("transform", function(d, i) {
                    return "translate(0," + (i * 20 + 10) + ")";
                });

            legendG.append("rect")
                .attr("x", width - 19 + legendShiftX)
                .attr("y", 0 + legendShiftY)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", function(d) {
                    return d[1]
                });

            legendG.append("text")
                .attr("x", width - 24 + legendShiftX)
                .attr("y", 9.5 + legendShiftY)
                .attr("dy", "0.32em")
                .attr("fill", legendColor)
                .text(function(d) {
                    return d[0];
                });


        })
    }

    chart.legendShiftX = function(value) {
        if (!arguments.length) return legendShiftX
        legendShiftX = value;
        return chart;
    }

    chart.legendShiftY = function(value) {
        if (!arguments.length) return legendShiftY
        legendShiftY = value;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return width
        width = value;
        return chart;
    }

    chart.height = function(value) {
        if (!arguments.length) return height
        height = value;
        return chart;
    }

    chart.linkStroke = function(value) {
        if (!arguments.length) return linkStroke
        linkStroke = value;
        return chart;
    }

    chart.nodeStroke = function(value) {
        if (!arguments.length) return nodeStroke
        nodeStroke = value;
        return chart;
    }

    chart.nodeStrokeWidth = function(value) {
        if (!arguments.length) return nodeStrokeWidth
        nodeStrokeWidth = value;
        return chart;
    }

    chart.legend = function(value) {
        if (!arguments.length) return legend
        legend = value;
        return chart;
    }

    chart.legendColor = function(value) {
        if (!arguments.length) return legendColor
        legendColor = value;
        return chart;
    }

    chart.colors = function(value) {
        if (!arguments.length) return colors
        colors = value;
        return chart;
    }

    chart.collide = function(value) {
        if (!arguments.length) return collide
        collide = value;
        return chart;
    }

    chart.thicknessRange = function(value) {
        if (!arguments.length) return thicknessRange
        thicknessRange = value;
        return chart;
    }

    chart.radiusRange = function(value) {
        if (!arguments.length) return radiusRange
        radiusRange = value;
        return chart;
    }

    return chart
}