function wbBarChart() {
    "use strict";

    var width = 500
    var height = 500
    var xSelector = "x"
    var ySelector = "y"
    var scaleX
    var scaleY
    var fill = "blue"

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            data.forEach(function(d) {
                d[ySelector] = +d[ySelector]
            })

            scaleX = d3
                .scaleBand()
                .rangeRound([0, width], .1)
                .paddingInner(0.1)
                .domain(data.map(function(d) {
                    return d[xSelector]
                }))

            scaleY = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(data, function(d) {
                    return d[ySelector];
                })])

            s.selectAll("rect")
                .data(data)
                .enter().append("rect")
                .attr("class", "rects")
                .attr("x", function(d) {
                    return scaleX(d[xSelector]);
                })
                .attr("width", scaleX.bandwidth())
                .attr("y", function(d) {
                    return scaleY(d[ySelector]);
                })
                .attr("height", function(d) {
                    return height - scaleY(d[ySelector]);
                })
                .attr("fill", fill)

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

    return chart
}