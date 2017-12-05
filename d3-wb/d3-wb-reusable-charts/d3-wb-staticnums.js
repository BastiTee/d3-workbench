function wbStaticNumbers() {
    "use strict";

    var width = 500
    var height = 500
    var fillNumber = "black"
    var fillLabel = "red"

    // internal
    var debug = false
    var REF_FONTSIZE = 20

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var cw = width / data.length // width of column
            var cp = (width * 0.1) / (data.length - 1) // padding betw. column
            var ol = 0.25 // number-label overlap percent

            s.selectAll("number-value")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d, i) {
                    return i * cw
                })
                .attr("y", height)
                .attr("text-anchor", "left")
                .attr("dominant-baseline", "baseline")
                .attr("fill", fillNumber)
                .style("font-size", REF_FONTSIZE + "px")
                .style("font-weight", "bold")
                .text(function(d) {
                    return d.value
                })
                .style("font-size", function(d) {
                    return calculateNewFontsize(this, cw, cp) + "px"
                })
                .each(function(d) {
                    d.numberBox = this.getBBox()
                })

            debugNumbers(s, data)

            s.selectAll("number-label")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d, i) {
                    return i * cw
                })
                .attr("y", function(d) {
                    return height - d.numberBox.height + (ol * d.numberBox.height)
                })
                .attr("text-anchor", "left")
                .attr("fill", fillLabel)
                .style("font-size", REF_FONTSIZE + "px")
                .text(function(d) {
                    return d.label
                })
                .style("font-size", function(d) {
                    return calculateNewFontsize(this, cw, cp) + "px"
                })
                .each(function(d) {
                    d.numberBox = this.getBBox()
                });

            debugLabels(s, data)
        })
    }

    var calculateNewFontsize = function(thiss, cw, cp) {
        var textLength = thiss.getComputedTextLength()
        if (debug) {
            console.log("TL=" + textLength)
            console.log(thiss.getBBox().width)
        }
        return (cw - cp) / textLength * REF_FONTSIZE
    }

    var debugNumbers = function(s, data) {
        if (!debug) return
        s.selectAll(".debug-rect-numbers")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "debug-rect-numbers")
            .attr("x", function(d) {
                return d.numberBox.x
            })
            .attr("y", function(d) {
                return d.numberBox.y
            })
            .attr("height", function(d) {
                return d.numberBox.height
            })
            .attr("width", function(d) {
                return d.numberBox.width
            })
            .style("stroke", "green")
            .style("stroke-width", 1)
            .style("fill", "none")
    }

    var debugLabels = function(s, data) {
        if (!debug) return
        s.selectAll(".debug-rect-labels")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "debug-rect-labels")
            .attr("x", function(d) {
                return d.numberBox.x
            })
            .attr("y", function(d) {
                return d.numberBox.y
            })
            .attr("height", function(d) {
                return d.numberBox.height
            })
            .attr("width", function(d) {
                return d.numberBox.width
            })
            .style("stroke", "red")
            .style("stroke-width", 1)
            .style("fill", "none")
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

    chart.fillNumber = function(value) {
        if (!arguments.length) return fillNumber
        fillNumber = value;
        return chart;
    }

    chart.fillLabel = function(value) {
        if (!arguments.length) return fillLabel
        fillLabel = value;
        return chart;
    }

    return chart
}