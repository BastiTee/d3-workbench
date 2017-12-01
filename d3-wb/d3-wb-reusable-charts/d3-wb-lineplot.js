function wbLinePlot() {
    "use strict";

    var width = 500
    var height = 500
    var xAxisScale = d3.scaleLinear()
    var yAxisScale = d3.scaleLinear()
    var xDataPoints = "x"
    var yDataPoints = ["y"]
    var scaleX;
    var scaleY;
    var xMinMax;
    var yMinMax;
    var setYMinToZero = false
    var stroke = ["red"]
    var strokeWidth = 1
    var axisColor = "white"
    var curve = [d3.curveBasis]
    var legendFill = "black"
    var legendX = 0
    var legendY = 0
    var update = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            if (yDataPoints.length * 2 != (curve.length + stroke.length)) {
                throw Error("If you enter more than one y-data-point, you need to set the curve and stroke options with equally-sized arrays.")
            }

            var legend = s.append("g")
                .attr("font-size", "75%")
                .attr("text-anchor", "end")
                .attr("transform", "translate(" + legendX + "," + legendY + ")")
                .selectAll("g")
                .data(yDataPoints)
                .enter().append("g")
                .attr("transform", function(d, i) {
                    return "translate(0," + i * 20 + ")";
                });

            var rw = 19
            legend.append("rect")
                .attr("x", -rw)
                .attr("width", rw)
                .attr("height", rw)
                .attr("fill", function(d, i) {
                    return (stroke[i])
                })

            legend.append("text")
                .attr("x", -rw - 3)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) {
                    return d;
                })
                .attr("fill", legendFill)

            update = function(data) {

                if (xMinMax === undefined) {
                    xMinMax = d3.extent(data, function(d) {
                        return d[xDataPoints];
                    })
                }
                if (yMinMax === undefined) {
                    yMinMax = d3.extent(data.map(function(d) {
                        return yDataPoints.map(function(e) {
                            return +d[e]
                        })
                    }).reduce(function(a, b) {
                        return a.concat(b)
                    }))
                    if (setYMinToZero) {
                        yMinMax[0] = 0
                    }
                }
                scaleX = xAxisScale.rangeRound([0, width]).domain(xMinMax);
                scaleY = yAxisScale.rangeRound([height, 0]).domain(yMinMax);

                yDataPoints.forEach(function(d, i) {
                    var line = d3.line()
                        .curve(curve[i])
                        .x(function(d) {
                            return scaleX(d[xDataPoints]);
                        })
                        .y(function(d) {
                            return scaleY(d[yDataPoints[i]]);
                        })

                    var classs = "line-" + yDataPoints[i]
                    if (s.select("." + classs).empty()) {
                        s.datum(data).append("path")
                            .attr("class", classs)
                            .attr("d", line)
                            .style("fill", "none")
                            .style("stroke-linecap", "round")
                            .style("stroke-linejoin", "round")
                            .style("stroke-width", strokeWidth)
                            .style("stroke", stroke[i])
                    } else {
                        s.datum(data).select("." + classs)
                            .transition().duration(500)
                            .attr("d", line)
                    }
                })

            }
            update(data)
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

    chart.xDataPoints = function(value) {
        if (!arguments.length) return xDataPoints
        xDataPoints = value;
        return chart;
    }

    chart.yDataPoints = function(value) {
        if (!arguments.length) return yDataPoints
        yDataPoints = value.constructor === Array ? value : [value]
        return chart;
    }

    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor
        axisColor = value;
        return chart;
    }

    chart.stroke = function(value) {
        if (!arguments.length) return stroke
        stroke = value.constructor === Array ? value : [value]
        return chart;
    }

    chart.curve = function(value) {
        if (!arguments.length) return curve
        curve = value.constructor === Array ? value : [value]
        return chart;
    }

    chart.scaleX = function() {
        return scaleX;
    }

    chart.scaleY = function() {
        return scaleY;
    }

    chart.update = function(data) {
        update(data)
        return chart
    }

    chart.xMinMax = function(value) {
        if (!arguments.length) return xMinMax
        xMinMax = value;
        return chart;
    }

    chart.yMinMax = function(value) {
        if (!arguments.length) return yMinMax
        yMinMax = value;
        return chart;
    }

    chart.legendFill = function(value) {
        if (!arguments.length) return legendFill
        legendFill = value;
        return chart;
    }

    chart.legendX = function(value) {
        if (!arguments.length) return legendX
        legendX = value;
        return chart;
    }

    chart.legendY = function(value) {
        if (!arguments.length) return legendY
        legendY = value;
        return chart;
    }

    chart.strokeWidth = function(value) {
        if (!arguments.length) return strokeWidth
        strokeWidth = value;
        return chart;
    }

    chart.setYMinToZero = function(value) {
        if (!arguments.length) return setYMinToZero
        setYMinToZero = value;
        return chart;
    }

    return chart
}