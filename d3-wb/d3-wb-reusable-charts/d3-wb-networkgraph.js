function wbNetworkDiagram() {
    "use strict";

    var width = 500
    var height = 500
    var fill = "black"
    var legend;
    var collide = 0.5
    var thicknessRange = [1, 20]
    var colors = d3.scaleOrdinal(["red", "green", "blue"])

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

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

            var radius = d3.scaleLinear().domain(
                d3.extent(data.nodes, function(d) {
                    return d.weight
                })).range([5, 20])

            data.nodes.forEach(function(d) {
                d.r = radius(d.weight);
            })

            var minMax2 = d3.extent(data.links, function(d) {
                return d.value
            })
            var thick = d3.scaleLinear().domain(minMax2).range(thicknessRange)

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function(d) {
                    return d.id;
                }))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("x", d3.forceX(width).strength(0.06))
                .force("y", d3.forceY(height).strength(0.06))
                .force("collide", d3.forceCollide().radius(function(d) {
                    return d.r + collide;
                }).iterations(4))

            var link = s.append("g")
                .selectAll("line")
                .data(data.links)
                .enter().append("line")
                .attr("stroke-width", function(d) {
                    return thick(d.value)
                })
                .style("stroke", fill)
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
                .style("stroke", fill)
                .style("stroke-width", "1")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            simulation
                .nodes(data.nodes)
                .on("tick", ticked);
            simulation.force("link")
                .links(data.links);


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
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", function(d) {
                    return d[1]
                });

            legendG.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .attr("fill", fill)
                .text(function(d) {
                    return d[0];
                });

            function ticked() {
                link
                    .attr("x1", function(d) {
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
                node
                    .attr("cx", function(d) {
                        return d.x;
                    })
                    .attr("cy", function(d) {
                        return d.y;
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
        })
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

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    chart.legend = function(value) {
        if (!arguments.length) return legend
        legend = value;
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

    return chart
}