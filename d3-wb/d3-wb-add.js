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

        function chart(selection) {

            selection.each(function(data, i) {
                injectAxisColor(color, "wb-axis-x")
                var s = d3.select(this)
                s.append("g")
                    .attr("transform", "translate(0," + y + ")")
                    .attr("class", "wb-axis wb-axis-x").call(type(scale))
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

        return chart
    }

    var xAxisBottom = function(scale) {
        return xAxis(scale).type(d3.axisBottom)
    }

    var yAxis = function(scale) {

        var color = "red"
        var type = d3.axisLeft
        var x = 0

        function chart(selection) {

            selection.each(function(data, i) {
                injectAxisColor(color, "wb-axis-y")
                var s = d3.select(this)
                s.append("g")
                    .attr("class", "wb-axis wb-axis-y")
                    .attr("transform", "translate(" + x + ",0)")
                    .call(type(scale))
            })
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

        return chart
    }
    
    var yAxisRight = function(scale) {
        return yAxis(scale).type(d3.axisRight)
    }

    var title = function(text) {

        var color = "red"
        var fontSize = "140%"

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()
                s.append("text")
                    .attr("class", "wb-title")
                    .attr("x", root.width / 2)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "hanging")
                    .style("fill", color)
                    .style("font-size", fontSize)
                    .text(text);
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
        return chart
    }

    var xAxisLabel = function(text) {

        var color = "red"
        var padding = 10
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
                    .attr("alignment-baseline", function() {
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
        var padding = 10
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
                    .style("fill", color)
                    .attr("alignment-baseline", "hanging")
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

    var infoBox = function(text) {

        var color = "yellow"
        var fill = "blue"
        var fontSize = "80%"
        var padding = 10
        var margin = 10
        var opacity = 0.8
        var lineHeight = 20
        var orientation = "topright"

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()

                var g = s.append("g")
                var box = g.append("rect")
                var textG = g.append("text")
                var split = text.split("\n")
                for (var i in split) {
                    textG.append("tspan")
                        .style("text-anchor", "end")
                        .style("alignment-baseline", "hanging")
                        .style("font-size", fontSize)
                        .style("fill", color)
                        .attr("x", 0)
                        .attr("dy", function() {
                            return i == 0 ? 0 : lineHeight
                        })
                        .text(split[i])
                }
                var txtBox = textG.node().getBBox()
                box.attr("rx", "5").attr("ry", "5")
                    .attr("width", txtBox.width + padding * 2)
                    .attr("height", txtBox.height + padding * 2)
                    .attr("x", txtBox.x - padding)
                    .attr("y", txtBox.y - padding)
                    .style("fill", fill)
                    .style("opacity", opacity)
                var xAbs = root.width - padding - margin
                var yAbs = padding + margin
                g.attr("transform", "translate(" + xAbs + "," + yAbs + ")")
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

    d3wb.add = {
        xAxis: xAxis,
        xAxisBottom: xAxisBottom,
        xAxisLabel: xAxisLabel,
        yAxis: yAxis,
        yAxisRight: yAxisRight,
        yAxisLabel: yAxisLabel,
        title: title,
        infoBox: infoBox,
        shadow: shadow
    }

})()