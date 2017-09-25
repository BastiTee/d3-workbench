function wbBarChart() {
    "use strict";

    var width = 500
    var height = 500
    var padding = 0.1
    var widthFactor = 1.0
    var xSelector = "x"
    var ySelector = "y"
    var scaleX
    var scaleY
    var yExtent
    var valuesShow
    var valuesFill = "black"
    var valuesPadding = 10
    var valueFormat = function(v) {
        return v
    }
    var fill = "blue"
    var update = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            data.forEach(function(d) {
                d[ySelector] = +d[ySelector]
            })

            scaleX = d3
                .scaleBand()
                .rangeRound([0, width], .1)
                .padding(padding)
                .domain(data.map(function(d) {
                    return d[xSelector]
                }))

            if (!yExtent) {
                yExtent = [0, d3.max(data, function(d) {
                    return d[ySelector];
                })]
            }

            scaleY = d3.scaleLinear()
                .range([height, 0])
                .domain(yExtent)

            update = function(data) {
                s.selectAll(".rects")
                    .remove()
                    .exit()
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "rects")
                    .attr("x", function(d) {
                        if (widthFactor >= 1) {
                            return scaleX(d[xSelector])
                        } else {
                            var diff = scaleX.bandwidth() -
                                scaleX.bandwidth() * widthFactor
                            return scaleX(d[xSelector]) + diff / 2
                        }
                    })
                    .attr("width", function(d) {
                        return scaleX.bandwidth() * widthFactor
                    })
                    .attr("y", function(d) {
                        return scaleY(d[ySelector]);
                    })
                    .attr("height", function(d) {
                        return height - scaleY(d[ySelector]);
                    })
                    .attr("fill", function(d, i) {
                        if (typeof fill === "string") {
                            return fill
                        } else if (typeof fill === "function") {
                            return fill(i)
                        } else if (typeof fill === "object" &&
                            String(fill).startsWith('rgb')) {
                            return fill
                        } else {
                            return fill[i]
                        }
                    })

                if (!valuesShow) {
                    return;
                }

                var values = s.selectAll(".values")
                    .remove()
                    .exit()
                    .data(data)
                    .enter().append("text")
                    .attr("class", "values")
                    .attr("fill", valuesFill)
                    .attr("text-anchor", "middle")
                    .attr("x", function(d) {
                        return scaleX(d[xSelector]) + scaleX.bandwidth() / 2
                    })
                    .attr("y", function(d) {
                        return scaleY(d[ySelector]) - valuesPadding
                    })
                    .text(function(d) {
                        return valueFormat(d[ySelector])
                    })
            }
            update(data)

        })
    }

    chart.update = function(data) {
        update(data)
        return chart
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

    chart.xSelector = function(value) {
        if (!arguments.length) return xSelector
        xSelector = value;
        return chart;
    }

    chart.ySelector = function(value) {
        if (!arguments.length) return ySelector
        ySelector = value;
        return chart;
    }

    chart.scaleX = function(value) {
        if (!arguments.length) return scaleX
        scaleX = value;
        return chart;
    }

    chart.scaleY = function(value) {
        if (!arguments.length) return scaleY
        scaleY = value;
        return chart;
    }

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    chart.yExtent = function(value) {
        if (!arguments.length) return yExtent
        yExtent = value;
        return chart;
    }

    chart.valuesShow = function(value) {
        if (!arguments.length) return valuesShow
        valuesShow = value;
        return chart;
    }

    chart.valuesFill = function(value) {
        if (!arguments.length) return valuesFill
        valuesFill = value;
        return chart;
    }

    chart.valueFormat = function(value) {
        if (!arguments.length) return valueFormat
        valueFormat = value;
        return chart;
    }

    chart.padding = function(value) {
        if (!arguments.length) return padding
        padding = value;
        return chart;
    }

    chart.widthFactor = function(value) {
        if (!arguments.length) return widthFactor
        widthFactor = value;
        return chart;
    }

    return chart
}