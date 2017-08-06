(function() {
    "use strict";

    d3wb.plotPackedBubbles = function(data, cv, attr) {

        var minMax = d3.extent(data, function(d) {
            return d.value
        })
        var bgColors = d3wb.getLinearColorGradient(minMax, 
            [d3wb.color.blue, d3wb.color.blue.fade(10)]);
        var fgColors = d3wb.getLinearColorGradient(minMax, [d3wb.color.foreground.fade(30), d3wb.color.foreground]);;
        if (attr.fadeOpacity) {
            var opScale = d3.scaleLog().domain(minMax)
                .range(attr.fadeOpacity);
        }

        var pack = d3.pack()
            .size([cv.wid, cv.hei])
            .padding(0.3);

        var root = d3.hierarchy({
                children: data
            })
            .sum(function(d) {
                return d.value;
            })

        var nodes = cv.svg.selectAll("node")
            .data(pack(root).leaves())
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        var tt = {
            selector: attr.tooltipSelector,
            root: cv
        }

        nodes
            .append("a").attr("xlink:href", function(d) {
                return d.data.link
            })
            .append("circle")
            .attr("id", function(d) {
                return d.id;
            })
            .call(d3wb.tooltip, tt)
            .transition().duration(attr.transitionDuration)
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d) {
                return bgColors(d.value)
            })
            .style("opacity", function(d) {
                if (attr.fadeOpacity) {
                    return opScale(d.value)
                }
                return "1.0";
            })

        nodes
            .append("a").attr("xlink:href", function(d) {
                return d.data.link
            })
            .append("text")
            .call(d3wb.tooltip, tt)
            .style("font-size", "10px")
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .attr("x", 0)
            .attr("y", 0)
            .text(function(d) {
                return d.data.id
            })
            .style("font-size", function(d) {
                return ((2 * d.r - 10) / this.getComputedTextLength() * 10) + "px";
            })
            .style("opacity", function(d) {
                if (attr.fadeOpacity) {
                    return opScale(d.value)
                }
                return "1.0";
            })
            .style("fill", function(d) {
                return cv.config.bgColor
            })
            .transition().duration(attr.transitionDuration * 2)
            .style("fill", function(d) {
                return fgColors(d.value)
            })
    }

})()