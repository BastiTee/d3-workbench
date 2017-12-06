(function() {
    "use strict";

    var injectAxisColor = function(color, cclass) {
        d3wb.util.injectCSS(`
        .` + cclass + ` line{
          stroke: ` + color + `;
        }
        .` + cclass + ` path{
          stroke: ` + color + `;
        }
        .` + cclass + ` text{
          fill: ` + color + `;
        }
        `)
    }

    var xAxis = function(scale) {

        var color = "red"
        var type = d3.axisTop
        var y = 0
        var rotation = undefined

        function chart(selection) {

            selection.each(function(data, i) {
                injectAxisColor(color, "wb-axis-x")
                var s = d3.select(this)
                var axis = s.append("g")
                    .attr("transform", "translate(0," + y + ")")
                    .attr("class", "wb-axis wb-axis-x").call(type(scale))
                if (rotation == 90) {
                    axis.selectAll("text")
                        .attr("y", -2)
                        .attr("x", -9)
                        .attr("dy", ".35em")
                        .style("text-anchor", "end")
                        .attr("transform", "rotate(-90)")
                }
            })
        }

        chart.type = function(value) {
            if (!arguments.length) return type
            type = value;
            return chart;
        }

        chart.y = function(value) {
            if (!arguments.length) return y
            y = value;
            return chart;
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.rotation = function(value) {
            if (!arguments.length) return rotation
            rotation = value;
            return chart;
        }

        chart.scale = function(value) {
            if (!arguments.length) return scale
            scale = value;
            return chart;
        }

        chart.fontSize = function(value) {
            d3wb.util.injectCSS(`
                .wb-axis-x text {
                  font-size: ` + value + `;
              }`)
            return chart;
        }

        return chart
    }

    var xAxisBottom = function(scale) {
        return xAxis(scale).type(d3.axisBottom)
    }

    var yAxis = function(scale) {

        // configurable
        var color = "red"
        var type = d3.axisLeft
        var x = 0
        var format = function(scale) {
            return scale
        }
        // internal
        var update = function() {}
        var g

        function chart(selection) {

            selection.each(function(data, i) {
                injectAxisColor(color, "wb-axis-y")
                var s = d3.select(this)
                g = s.append("g")
                    .attr("class", "wb-axis wb-axis-y")
                    .attr("transform", "translate(" + x + ",0)")
                update = function(scale) {
                    g.call(format(type(scale)))
                }
                update(scale)
            })
        }

        chart.update = function(scale) {
            update(scale)
            return chart
        }

        chart.format = function(value) {
            if (!arguments.length) return format
            format = value;
            return chart;
        }

        chart.type = function(value) {
            if (!arguments.length) return type
            type = value;
            return chart;
        }

        chart.x = function(value) {
            if (!arguments.length) return x
            x = value;
            return chart;
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.scale = function(value) {
            if (!arguments.length) return scale
            scale = value;
            return chart;
        }

        chart.fontSize = function(value) {
            d3wb.util.injectCSS(`
                .wb-axis-y text {
                  font-size: ` + value + `;
              }`)
            return chart;
        }

        return chart
    }

    var yAxisRight = function(scale) {
        return yAxis(scale).type(d3.axisRight)
    }

    var title = function(text) {

        var color = "red"
        var fontSize = "140%"

        var update = function() {}

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()
                s.append("text")
                    .attr("class", "wb-title")
                    .attr("x", root.width / 2)
                    .attr("y", 5)
                    .attr("text-anchor", "middle")
                    .attr("dominant-baseline", "hanging")
                    .style("pointer-events", "none")
                    .style("fill", color)
                    .style("font-size", fontSize)

                update = function() {
                    s.selectAll(".wb-title").text(text)
                }
                update()
            })
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.fontSize = function(value) {
            if (!arguments.length) return fontSize
            fontSize = value;
            return chart;
        }

        chart.text = function(value) {
            if (!arguments.length) return text
            text = value
            return chart;
        }

        chart.update = function() {
            update()
        }

        return chart
    }

    var xAxisLabel = function(text) {

        var color = "red"
        var padding = 15
        var orientation = "top"

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()
                s.append("text") // text label for the x axis
                    .attr("transform", function() {
                        var t = "translate(" + (root.width / 2) + ","
                        if (orientation == "top")
                            t += padding
                        else
                            t += root.height - padding
                        t += ")"
                        return t
                    })
                    .style("text-anchor", "middle")
                    .style("fill", color)
                    .attr("dominant-baseline", function() {
                        if (orientation == "top")
                            return "hanging"
                        else
                            return "auto"
                    })
                    .text(text);
            })
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.orientation = function(value) {
            if (!arguments.length) return orientation
            orientation = value;
            return chart;
        }
        return chart
    }

    var yAxisLabel = function(text) {

        var color = "red"
        var padding = 5
        var orientation = "left"

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()
                s.append("text") // text label for the x axis
                    .attr("transform", function() {
                        var t = "translate("
                        if (orientation == "left")
                            t += padding
                        else
                            t += root.width - padding
                        t += "," + root.height / 2 + ") rotate("
                        if (orientation == "left")
                            t += "-90"
                        else
                            t += "90"
                        t += ")"
                        return t
                    })
                    .style("text-anchor", "middle")
                    .attr("dominant-baseline", "hanging")
                    .style("fill", color)
                    .text(text)

            })
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.orientation = function(value) {
            if (!arguments.length) return orientation
            orientation = value;
            return chart;
        }
        return chart
    }

    var shadow = function() {

        var blur = 3
        var xOffset = 2
        var yOffset = 1
        var opacity = 0.4
        var id = d3wb.util.guid()

        function chart(selection) {

            selection.each(function() {
                var s = d3.select(this)
                var svg = d3.select(this.ownerSVGElement)
                var defs = svg.append('defs');
                var filter = defs.append('filter')
                    .attr('id', id)
                filter.append('feGaussianBlur')
                    .attr('in', 'SourceAlpha')
                    .attr('stdDeviation', blur)
                    .attr('result', 'blur')
                filter.append('feOffset')
                    .attr('in', 'blur')
                    .attr('dx', xOffset)
                    .attr('dy', yOffset)
                    .attr('result', 'offsetBlur');
                filter.append('feComponentTransfer')
                    .append('feFuncA')
                    .attr('type', 'linear')
                    .attr("slope", opacity)
                var feMerge = filter.append('feMerge');
                feMerge.append('feMergeNode')
                    .attr('in", "offsetBlur')
                feMerge.append('feMergeNode')
                    .attr('in', 'SourceGraphic');

                s.style("filter", "url(#" + id + ")")
            })
        }
        return chart
    }

    var legend = function() {

        var color = "white"
        var stroke
        var colors = ["red", "green", "blue"]
        var text = ["Item 1", "Item 2", "Item 3"]
        var x = 0
        var y = 0
        var symbol = d3.symbolCircle
        var symbolSize = 100

        function chart(selection) {

            selection.each(function() {
                var s = d3.select(this)
                s.append("g")
                    .attr("class", "legend")
                    .attr("transform", "translate(" + x + "," + y + ")")
                var ordinal = d3.scaleOrdinal()
                    .domain(text.map(function(d) {
                        return d;
                    }))
                    .range(text.map(function(d, i) {
                        return colors[i];
                    }));
                var legend = d3.legendColor()
                    .shape("path",
                        d3.symbol().type(symbol).size(symbolSize)())
                    .scale(ordinal)
                s.select(".legend")
                    .call(legend)
                    .style("fill", color)
                    .style("font-size", "90%")
                if (stroke) {
                    s.selectAll("path.swatch").style("stroke", stroke)
                }
            })
        }

        chart.stroke = function(value) {
            if (!arguments.length) return stroke
            stroke = value;
            return chart;
        }

        chart.x = function(value) {
            if (!arguments.length) return x
            x = value;
            return chart;
        }

        chart.y = function(value) {
            if (!arguments.length) return y
            y = value;
            return chart;
        }

        chart.text = function(value) {
            if (!arguments.length) return text
            text = value;
            return chart;
        }

        chart.colors = function(value) {
            if (!arguments.length) return colors
            colors = value;
            return chart;
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.symbol = function(value) {
            if (!arguments.length) return symbol
            symbol = value;
            return chart;
        }

        chart.symbolSize = function(value) {
            if (!arguments.length) return symbolSize
            symbolSize = value;
            return chart;
        }

        return chart
    }

    d3wb.add = {
        xAxis: xAxis,
        xAxisBottom: xAxisBottom,
        xAxisLabel: xAxisLabel,
        yAxis: yAxis,
        yAxisRight: yAxisRight,
        yAxisLabel: yAxisLabel,
        title: title,
        shadow: shadow,
        legend: legend
    }

})()