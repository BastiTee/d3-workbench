(function() {
    "use strict";

    d3wb.plotScatterPlot = function(data, cv, attr) {

        var rectSize = 5

        var x = attr.xAxisScale.range([0, cv.wid]).domain(
            d3.extent(data, function(d) {
                return d[attr.xDataPoints];
            }));

        var y = attr.yAxisScale.range([cv.hei, 0]).domain(
            d3.extent(data, function(d) {
                return d[attr.yDataPoints];
            }));

        var color = d3wb.getOrdinalColors()

        var rects = cv.svg.selectAll("circle")
            .data(data).enter().append("circle")
            .attr("transform", function(d) {
                return "translate(" +
                    (x(d[attr.xDataPoints]) + rectSize) +
                    ", " +
                    (y(d[attr.yDataPoints]) - rectSize) +
                    ")"
            })
            .attr("r", rectSize)
            .style("fill", function(d) {
                return color(d[attr.colorSelector])
            })

        var tt = d3wb.tooltip(cv, {
            selector: attr.tooltipSelector
        })
        rects
            .on("mouseover", tt.mouseover)
            .on("mousemove", tt.mousemove)
            .on("mouseout", tt.mouseout)


        d3wb.appendYAxis(cv, y)
        d3wb.appendRotatedYAxisLabel(cv, attr.yLabel)
        d3wb.appendXAxis(cv, x)
        d3wb.appendXAxisLabel(cv, attr.xLabel)
        d3wb.appendTitle(cv, attr.title)

    };
})()