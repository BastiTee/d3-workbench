(function() {
    "use strict";

    d3wb.plotStaticNumbers = function(data, cv, attr) {

        var columnWid = cv.wid / data.length
        var columnPad = cv.wid / 20;
        var labelDownwardPercent = 0.2
        var colors = d3wb.colorCategory()


        cv.svg.selectAll("number-value")
            .data(data)
            .enter()
            .append("text")
            .text(function(d) {
                return d.name;
            })
            .attr("x", function(d, i) {
                return (i * columnWid) + (columnPad / 2);
            })
            .attr("y", cv.hei)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "baseline")
            .attr("fill", colors[1])
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

        cv.svg.selectAll("number-label")
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
                return cv.hei - d.numberBox.height + (labelDownwardPercent * d.numberBox.height)
            })
            .attr("text-anchor", "left")
            .attr("fill", colors[6])
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

    };
})()
