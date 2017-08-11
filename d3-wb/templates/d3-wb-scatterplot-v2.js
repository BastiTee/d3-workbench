function scatterPlot() {
    "use strict";

    var width = 800
    var height = 300
    var xAxisScale = d3.scaleLog()
    var yAxisScale = d3.scaleLog()
    var zAxisScale = d3.scaleLog()
    var colorLow = "green"
    var colorHigh = "red"
    var xDataPoints = "x"
    var yDataPoints = "y"
    var zDataPoints = "z"
    var axisColor = "white"

    function chart(selection) {

        selection.each(function(data, i) {
            var sel = d3.select(this)

            var rectSize = 5

            var x = xAxisScale.range([0, width]).domain(
                d3.extent(data, function(d) {
                    return d[xDataPoints];
                }));

            var y = yAxisScale.range([height, 0]).domain(
                d3.extent(data, function(d) {
                    return d[yDataPoints];
                }));

            var zMinMax = d3.extent(data, function(d) {
                return d[zDataPoints];
            })
            var z = zAxisScale.domain(zMinMax)
                .interpolate(d3.interpolate)
                .range([colorLow, colorHigh]);

            var rects = sel.selectAll("circle")
                .data(data).enter().append("circle")
                .attr("transform", function(d) {
                    return "translate(" +
                        (x(d[xDataPoints]) + rectSize) +
                        ", " +
                        (y(d[yDataPoints]) - rectSize) +
                        ")"
                })
                .attr("r", rectSize)
                .style("fill", function(d) {
                    return z(d[zDataPoints])
                })

            sel.append("g")
                .attr("class", "axis")
                .call(d3.axisLeft(y))
            sel.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisTop(x))

            sel.selectAll(".axis line")
                .attr("stroke", axisColor)
            sel.selectAll(".axis path")
                .attr("stroke", axisColor)
            sel.selectAll(".axis text")
                .attr("fill", axisColor)


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
    chart.xAxisScale = function(value) {
        if (!arguments.length) return xAxisScale
        xAxisScale = value;
        return chart;
    }

    chart.yAxisScale = function(value) {
        if (!arguments.length) return yAxisScale
        yAxisScale = value;
        return chart;
    }

    chart.zAxisScale = function(value) {
        if (!arguments.length) return zAxisScale
        zAxisScale = value;
        return chart;
    }

    chart.xDataPoints = function(value) {
        if (!arguments.length) return xDataPoints
        xDataPoints = value;
        return chart;
    }
    chart.yDataPoints = function(value) {
        if (!arguments.length) return yDataPoints
        yDataPoints = value;
        return chart;
    }
    chart.zDataPoints = function(value) {
        if (!arguments.length) return zDataPoints
        zDataPoints = value;
        return chart;
    }
    
    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor
        axisColor = value;
        return chart;
    }
    
    
    chart.colorLow = function(value) {
        if (!arguments.length) return colorLow
        colorLow = value;
        return chart;
    }
    
    chart.colorHigh = function(value) {
        if (!arguments.length) return colorHigh
        colorHigh = value;
        return chart;
    }

    return chart
}
// 
// (function() {
//     "use strict";
// 
//     d3wb.plotScatterPlot = function(data, cv, attr) {
// 
//         var rectSize = 5
// 
//         var x = attr.xAxisScale.range([0, cv.wid]).domain(
//             d3.extent(data, function(d) {
//                 return d[attr.xDataPoints];
//             }));
// 
//         var y = attr.yAxisScale.range([cv.hei, 0]).domain(
//             d3.extent(data, function(d) {
//                 return d[attr.yDataPoints];
//             }));
// 
//         var color = d3wb.getOrdinalColors()
// 
//         var rects = sel.selectAll("circle")
//             .data(data).enter().append("circle")
//             .attr("transform", function(d) {
//                 return "translate(" +
//                     (x(d[attr.xDataPoints]) + rectSize) +
//                     ", " +
//                     (y(d[attr.yDataPoints]) - rectSize) +
//                     ")"
//             })
//             .attr("r", rectSize)
//             .style("fill", function(d) {
//                 return color(d[attr.colorSelector])
//             })
//             .call(d3wb.tooltip, {
//                 selector: attr.tooltipSelector,
//                 root: cv
//             })
// 
//         d3wb.appendYAxis(cv, y)
//         d3wb.appendRotatedYAxisLabel(cv, attr.yLabel)
//         d3wb.appendXAxis(cv, x)
//         d3wb.appendXAxisLabel(cv, attr.xLabel)
//         d3wb.appendTitle(cv, attr.title)
// 
//     };
// })()