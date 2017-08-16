(function() {
    "use strict";

    d3wb.plotNetworkGraph = function(data, cv, attr) {
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
        var thick = d3.scaleLinear().domain(minMax2).range([1, 20])

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function(d) {
                return d.id;
            }))
            // .force("size", [cv.wid, cv.hei])
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(cv.wid / 2, cv.hei / 2))
            .force("x", d3.forceX(cv.wid).strength(0.06))
            .force("y", d3.forceY(cv.hei).strength(0.06))
            .force("collide", d3.forceCollide().radius(function(d) {
                return d.r + 0.5;
            }).iterations(4))

        var link = cv.svg.append("g")
            .selectAll("line")
            .data(data.links)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                return thick(d.value)
            })
            .style("stroke", d3wb.color.foreground)
            .style("stroke-opacity", "0.6")

        var node = cv.svg.append("g")
            .selectAll("circle")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", function(d) {
                return d.r
            })
            .attr("fill", function(d) {
                return attr.groupColorScale(d.group);
            })
            .style("stroke", d3wb.color.foreground)
            .style("stroke-width", "1")
            .call(wbCooltip().selector(attr.tooltipSelector))
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        simulation
            .nodes(data.nodes)
            .on("tick", ticked);
        simulation.force("link")
            .links(data.links);


        var legend = cv.svg.append("g")
            .attr("font-size", "75%")
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(attr.legend)
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + (i * 20 + 10) + ")";
            });

        legend.append("rect")
            .attr("x", cv.wid - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", function(d) {
                return d[1]
            });

        legend.append("text")
            .attr("x", cv.wid - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .attr("fill", d3wb.color.foreground)
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
    }

})()