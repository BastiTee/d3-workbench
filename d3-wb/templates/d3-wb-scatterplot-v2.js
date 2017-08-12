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
    var zDataPoints = "x"
    var axisColor = "white"
    var opacityDataPoints = undefined
    var opacityRange = [0.0, 1.0]
    var formatXAxis = function(xAxis) {
        return xAxis;
    }
    var formatYAxis = function(yAxis) {
        return yAxis;
    }

    var updateOpacityDataPoints = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var sel = d3.select(this)

            data = data.sort(function(a, b) {
                return a[zDataPoints] - b[zDataPoints]
            })

            var dpSize = 5

            var x = xAxisScale.range([0, width]).domain(
                d3.extent(data, function(d) {
                    return d[xDataPoints];
                }));

            var y = yAxisScale.range([height, 0]).domain(
                d3.extent(data, function(d) {
                    return d[yDataPoints];
                }));

            var z = zAxisScale.domain(d3.extent(data, function(d) {
                    return d[zDataPoints];
                }))
                .interpolate(d3.interpolate)
                .range([colorLow, colorHigh]);

            var rects = sel.selectAll("circle")
                .data(data).enter().append("circle")
                .attr("transform", function(d) {
                    return "translate(" +
                        (x(d[xDataPoints]) + dpSize) +
                        ", " +
                        (y(d[yDataPoints]) - dpSize) +
                        ")"
                })
                .attr("r", dpSize)
                .style("fill", function(d) {
                    return z(d[zDataPoints])
                })

            updateOpacityDataPoints = function() {
                if (opacityDataPoints !== undefined) {
                    var o = d3.scaleLog()
                        .domain(d3.extent(data, function(d) {
                            return d[opacityDataPoints];
                        })).range(opacityRange)
                }
                sel.selectAll("circle")
                    .transition()
                    .duration(750)
                    .attr("opacity", function(d) {
                        if (opacityDataPoints !== undefined) {
                            return o(d[opacityDataPoints])
                        }
                        return 1.0
                    })
            }
            updateOpacityDataPoints()

            var yAxis = d3.axisLeft(y)
            formatYAxis(yAxis)
            sel.append("g")
                .attr("class", "axis")
                .call(yAxis)

            var xAxis = d3.axisBottom(x)
            formatXAxis(xAxis)
            sel.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)

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

    chart.opacityDataPoints = function(value) {
        if (!arguments.length) return opacityDataPoints
        opacityDataPoints = value;
        updateOpacityDataPoints()
        return chart;
    }

    chart.opacityRange = function(value) {
        if (!arguments.length) return opacityRange
        opacityRange = value;
        updateOpacityDataPoints()
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

    chart.formatXAxis = function(value) {
        if (!arguments.length) return formatXAxis
        formatXAxis = value;
        return chart;
    }

    chart.formatYAxis = function(value) {
        if (!arguments.length) return formatYAxis
        formatYAxis = value;
        return chart;
    }

    return chart
}