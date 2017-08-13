function wbScatterPlot() {
    "use strict";

    var width = 800
    var height = 300
    var xAxisScale = d3.scaleLinear()
    var yAxisScale = d3.scaleLinear()
    var zAxisScale = d3.scaleLinear()
    var colorLow = "green"
    var colorHigh = "red"
    var xDataPoints = "x"
    var yDataPoints = "y"
    var zDataPoints = "x"
    var axisColor = "white"
    var href = function() {
        return undefined
    }
    var opacityDataPoints = undefined
    var opacityRange = [0.0, 1.0]
    var formatXAxis = function(xAxis) {
        return xAxis;
    }
    var formatYAxis = function(yAxis) {
        return yAxis;
    }

    var updateOpacityDataPoints = function() {}
    var updateAxis = function() {}
    var updateDataPoints = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var sel = d3.select(this)

            data = data.sort(function(a, b) {
                return a[zDataPoints] - b[zDataPoints]
            })

            var dpSize = 8

            var xMinMax = d3.extent(data, function(d) {
                return d[xDataPoints];
            })
            var yMinMax = d3.extent(data, function(d) {
                return d[yDataPoints];
            })
            var zMinMax = d3.extent(data, function(d) {
                return d[zDataPoints];
            })

            sel.selectAll(".datapoint")
                .data(data).enter()
                .append("a").attr("xlink:href", href)
                .append("rect")
                .attr("class", "datapoint")
                .attr("width", dpSize)
                .attr("height", dpSize)
                .attr("rx", 5)

            sel.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", "translate(0," + height + ")")
            sel.append("g").attr("class", "axis axis-y")
            var x, y, z, xAxis, yAxis

            updateAxis = function() {
                x = xAxisScale.range([0, width]).domain(xMinMax);
                y = yAxisScale.range([height, 0]).domain(yMinMax);
                z = zAxisScale.domain(zMinMax)
                    .interpolate(d3.interpolate)
                    .range([colorLow, colorHigh]);
                yAxis = d3.axisLeft(y)
                formatYAxis(yAxis)

                xAxis = d3.axisBottom(x)
                formatXAxis(xAxis)

                d3.select(".axis-x").transition().duration(500).call(xAxis)
                d3.select(".axis-y").transition().duration(500).call(yAxis)

                sel.selectAll(".axis line")
                    .attr("stroke", axisColor)
                sel.selectAll(".axis path")
                    .attr("stroke", axisColor)
                sel.selectAll(".axis text")
                    .attr("fill", axisColor)
                updateDataPoints()
            }
            updateAxis()

            sel.selectAll(".datapoint")
                .style("fill", function(d) {
                    return z(d[zDataPoints])
                })

            updateDataPoints = function() {
                sel.selectAll(".datapoint")
                    .transition().duration(500)
                    .attr("x", function(d) {
                        return x(d[xDataPoints]) - dpSize / 2
                    })
                    .attr("y", function(d) {
                        return y(d[yDataPoints]) - dpSize / 2
                    })

            }
            updateDataPoints()

            updateOpacityDataPoints = function() {
                if (opacityDataPoints !== undefined) {
                    var o = d3.scaleLog()
                        .domain(d3.extent(data, function(d) {
                            return d[opacityDataPoints];
                        })).range(opacityRange)
                }
                sel.selectAll(".datapoint")
                    .attr("opacity", function(d) {
                        if (opacityDataPoints !== undefined) {
                            return o(d[opacityDataPoints])
                        }
                        return 1.0
                    })
            }
            updateOpacityDataPoints()

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
        updateAxis()
        return chart;
    }

    chart.yAxisScale = function(value) {
        if (!arguments.length) return yAxisScale
        yAxisScale = value;
        updateAxis()
        return chart;
    }

    chart.zAxisScale = function(value) {
        if (!arguments.length) return zAxisScale
        zAxisScale = value;
        updateAxis()
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

    chart.href = function(value) {
        if (!arguments.length) return href
        href = value;
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