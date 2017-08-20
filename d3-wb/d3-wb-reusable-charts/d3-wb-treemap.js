function wbTreeMap() {
    "use strict";

    var width = 500
    var height = 500
    var colors = d3.scaleOrdinal(d3.schemeCategory20c)
    var fill = "black"

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var fader = function(color) {
                return d3.interpolateRgb(color, "#fff")(0.2);
            }
            var format = d3.format(",d");

            var treemap = d3.treemap()
                .tile(d3.treemapResquarify)
                .size([width, height])
                .round(true)
                .paddingInner(1.5);

            var root = d3.hierarchy(data)
                .eachBefore(function(d) {
                    d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
                })
                .sum(function(d) {
                    return d.size;
                })
                .sort(function(a, b) {
                    return b.height - a.height || b.value - a.value;
                });

            treemap(root);

            var cell = s.selectAll("g")
                .data(root.leaves())
                .enter().append("g")
                .attr("class", "cells")

                .attr("transform", function(d) {
                    return "translate(" + d.x0 + "," + d.y0 + ")";
                });

            cell.append("rect")
                .attr("id", function(d) {
                    return d.data.id;
                })
                .attr("width", function(d) {
                    return d.x1 - d.x0;
                })
                .attr("height", function(d) {
                    return d.y1 - d.y0;
                })
                .attr("fill", function(d) {
                    return colors(d.parent.data.id);
                });

            cell.append("clipPath")
                .attr("id", function(d) {
                    return "clip-" + d.data.id;
                })
                .append("use")
                .attr("xlink:href", function(d) {
                    return "#" + d.data.id;
                });

            cell.append("text")
                .style("font-size", "75%")
                .attr("clip-path", function(d) {
                    return "url(#clip-" + d.data.id + ")";
                })
                .selectAll("tspan")
                .data(function(d) {
                    return d.data.name.split(/(?=[A-Z][^A-Z])/g);
                })
                .enter().append("tspan")
                .attr("x", 4)
                .attr("y", function(d, i) {
                    return 13 + i * 10;
                })
                .attr("fill", fill)
                .text(function(d) {
                    return d;
                });



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

    chart.colors = function(value) {
        if (!arguments.length) return colors
        colors = value;
        return chart;
    }

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    return chart
}