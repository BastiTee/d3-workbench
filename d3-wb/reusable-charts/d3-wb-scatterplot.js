function wbScatterPlot() {
    "use strict";

    var width = 500
    var height = 500
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
    var update = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)
            var rsize = 8

            var xMinMax = d3.extent(data, function(d) {
                return d[xDataPoints];
            })
            var yMinMax = d3.extent(data, function(d) {
                return d[yDataPoints];
            })
            var zMinMax = d3.extent(data, function(d) {
                return d[zDataPoints];
            })

            s.selectAll(".datapoint")
                .data(data).enter()
                .append("a").attr("xlink:href", href)
                .append("rect")
                .attr("class", "datapoint")
                .attr("width", rsize)
                .attr("height", rsize)
                .attr("rx", 5)

            s.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", "translate(0," + height + ")")
            s.append("g").attr("class", "axis axis-y")
            var x, y, z, o, xAxis, yAxis

            update = function(first) {
                first = first || false

                if (opacityDataPoints !== undefined) {
                    o = d3.scaleLog()
                        .domain(d3.extent(data, function(d) {
                            return d[opacityDataPoints];
                        })).range(opacityRange)
                }
                x = xAxisScale.range([0, width]).domain(xMinMax);
                y = yAxisScale.range([height, 0]).domain(yMinMax);
                z = zAxisScale.domain(zMinMax)
                    .interpolate(d3.interpolate)
                    .range([colorLow, colorHigh]);
                yAxis = d3.axisLeft(y)
                formatYAxis(yAxis)
                xAxis = d3.axisBottom(x)
                formatXAxis(xAxis)

                s.select(".axis-x").transition().duration(500).call(xAxis)
                s.select(".axis-y").transition().duration(500).call(yAxis)

                s.selectAll(".axis line")
                    .attr("stroke", axisColor)
                s.selectAll(".axis path")
                    .attr("stroke", axisColor)
                s.selectAll(".axis text")
                    .attr("fill", axisColor)

                var up;
                if (first) {
                    up = s.selectAll(".datapoint")
                } else {
                    up = s.selectAll(".datapoint")
                        .transition().duration(500)
                }

                up.attr("opacity", function(d) {
                        if (opacityDataPoints !== undefined) {
                            return o(d[opacityDataPoints])
                        }
                        return 1.0
                    })
                    .attr("x", function(d) {
                        return x(d[xDataPoints]) - rsize / 2
                    })
                    .attr("y", function(d) {
                        return y(d[yDataPoints]) - rsize / 2
                    })
                    .style("fill", function(d) {
                        return z(d[zDataPoints])
                    })
            }
            update(true)

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
        return chart;
    }

    chart.opacityRange = function(value) {
        if (!arguments.length) return opacityRange
        opacityRange = value;
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

    chart.update = function() {
        update()
        return chart
    }

    return chart
}