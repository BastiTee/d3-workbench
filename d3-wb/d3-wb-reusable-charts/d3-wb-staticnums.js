function wbStaticNumbers() {
    "use strict";

    var width = 500
    var height = 500
    var fillNumber = "black"
    var fillLabel = "red"

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var columnWid = width / data.length
            var columnPad = width / 20;
            var labelDownwardPercent = 0.2

            s.selectAll("number-value")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d, i) {
                    return (i * columnWid) + (columnPad / 2);
                })
                .attr("y", height)
                .attr("text-anchor", "left")
                .attr("dominant-baseline", "baseline")
                .attr("fill", fillNumber)
                .style("font-size", "20")
                .style("font-weight", "bold")
                .text(function(d) {
                    return d.value
                })
                .style("font-size", function(d) {
                    var newFs = (columnWid - columnPad) / this.getComputedTextLength() * 20
                    return newFs;
                })
                .each(function(d) {
                    d.numberBox = this.getBBox()
                })

            s.selectAll("number-label")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d, i) {
                    return (i * columnWid) + (columnPad / 2);
                })
                .attr("y", function(d) {
                    return height - d.numberBox.height + (labelDownwardPercent * d.numberBox.height)
                })
                .attr("text-anchor", "left")
                .attr("fill", fillLabel)
                .style("font-size", "20")
                .text(function(d) {
                    return d.label
                })
                .style("font-size", function(d) {
                    var newFs = (columnWid - columnPad) / this.getComputedTextLength() * 20
                    return newFs;
                })
                .each(function(d) {
                    d.numberBox = this.getBBox()
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