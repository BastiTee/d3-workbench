(function() {
    "use strict";

    d3wb.plotTreeMap = function(data, cv, attr) {

        var fader = function(color) {
            return d3.interpolateRgb(color, "#fff")(0.2);
        }
        var color = d3wb.color.ordinal()
        var format = d3.format(",d");

        var treemap = d3.treemap()
            .tile(d3.treemapResquarify)
            .size([cv.wid, cv.hei])
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

        var cell = cv.svg.selectAll("g")
            .data(root.leaves())
            .enter().append("g")
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
                return color(d.parent.data.id);
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
            .attr("fill", d3wb.color.foreground)
            .text(function(d) {
                return d;
            });

        cv.svg.call(d3wb.add.title(attr.title).color(d3wb.color.foreground))

        cell.call(wbCooltip().selector(function(d) {
            return d.data.id + "\n" + format(d.value) + " " + attr.unit;
        }))

        return treemap
    }

})()