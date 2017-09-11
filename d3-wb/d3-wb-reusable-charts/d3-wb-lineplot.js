function wbLinePlot() {
    "use strict";

    var width = 500
    var height = 500
    var xAxisScale = d3.scaleLinear()
    var yAxisScale = d3.scaleLinear()
    var xDataPoints = "x"
    var yDataPoints = "y"
    var scaleX;
    var scaleY;
    var xMinMax;
    var yMinMax;
    var stroke = "red"
    var axisColor = "white"
    var curve = d3.curveBasis
    var update = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            s.append("path").attr("class", "line")

            update = function(data) {

                if (xMinMax === undefined) {
                    xMinMax = d3.extent(data, function(d) {
                        return d[xDataPoints];
                    })
                }
                if (yMinMax === undefined) {
                    yMinMax = d3.extent(data, function(d) {
                        return d[yDataPoints];
                    })
                }
                scaleX = xAxisScale.rangeRound([0, width]).domain(xMinMax);
                scaleY = yAxisScale.rangeRound([height, 0]).domain(yMinMax);
                var line = d3.line()
                    .curve(curve)
                    .x(function(d) {
                        return scaleX(d[xDataPoints]);
                    })
                    .y(function(d) {
                        return scaleY(d[yDataPoints]);
                    })

                var c = s.selectAll(".line")
                    .transition().duration(500)
                    .attr("d", line(data))
                    .style("fill", "none")
                    .style("stroke-linecap", "round")
                    .style("stroke-linejoin", "round")
                    .style("stroke-width", "1")
                    .style("stroke", stroke)

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
        yDataPoints = value;
        return chart;
    }

    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor
        axisColor = value;
        return chart;
    }

    chart.stroke = function(value) {
        if (!arguments.length) return stroke
        stroke = value;
        return chart;
    }

    chart.curve = function(value) {
        if (!arguments.length) return curve
        curve = value;
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

    return chart
}