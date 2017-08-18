(function() {
    "use strict";

    d3wb.plotSankeyDiagram = function(data, cv, attr) {

        d3wb.util.injectCSS(`
            .sankey-node rect {
                cursor: move;
                shape-rendering: crispEdges;
            }

            .sankey-node text {
                pointer-events: none;
                fill: ` + d3wb.color.foreground + `;
            }

            .sankey-link {
                fill: none;
                stroke: ` + d3wb.color.foreground + `;
                stroke-opacity: .2;
            }

            .sankey-link:hover {
                stroke-opacity: .5;
            }
        `)
        
        var formatNumber = d3.format(",.0f"),
            format = function(d) {
                return formatNumber(d) + " TWh";
            }
        var color = d3wb.color.ordinal()

        var sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .size([cv.wid, cv.hei]);

        var path = sankey.link();
        sankey
            .nodes(data.nodes)
            .links(data.links)
            .layout(32);

        var link = cv.svg.selectAll(".sankey-link")
            .data(data.links)
            .enter().append("path")
            .attr("class", "sankey-link")
            .attr("d", path)
            .style("stroke-width", function(d) {
                return Math.max(1, d.dy);
            })
            .sort(function(a, b) {
                return b.dy - a.dy;
            });

        link.append("title")
            .text(function(d) {
                return d.source.name + " → " + d.target.name + "\n" + format(d.value);
            });

        var node = cv.svg.selectAll(".sankey-node")
            .data(data.nodes)
            .enter().append("g")
            .attr("class", "sankey-node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .call(d3.drag()
                .subject(function(d) {
                    return d;
                })
                .on("start", function() {
                    this.parentNode.appendChild(this);
                })
                .on("drag", dragmove));

        node.append("rect")
            .attr("height", function(d) {
                return d.dy;
            })
            .attr("width", sankey.nodeWidth())
            .style("fill", function(d) {
                return d.color = color(d.name.replace(/ .*/, ""));
            })
            .style("stroke", function(d) {
                return d3wb.color.foreground;
            })
            .append("title")
            .text(function(d) {
                return d.name + "\n" + format(d.value);
            });

        node.append("text")
            .attr("x", -6)
            .attr("y", function(d) {
                return d.dy / 2;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .attr("transform", null)
            .text(function(d) {
                return d.name;
            })
            .filter(function(d) {
                return d.x < cv.wid / 2;
            })
            .attr("x", 6 + sankey.nodeWidth())
            .attr("text-anchor", "start");

        function dragmove(d) {
            d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(cv.hei - d.dy, d3.event.y))) + ")");
            sankey.relayout();
            link.attr("d", path);
        }
    }
})()