function wbDonutChart() {
    "use strict";

    var width = 500
    var height = 500
    var fillLegend = "black"
    var colors = d3.scaleOrdinal(d3.schemeCategory10)

    var update = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var pie = d3.pie()
                .value(function(d) {
                    return d.percent
                })
                .sort(null)
                .padAngle(.03);

            var outerRadius = Math.min(width, height) / 2;
            var innerRadius = Math.min(width, height) / 8;

            s.attr("transform", "translate(" +
                (width / 2) + "," +
                (height / 2) + ")");

            var arc = d3.arc()
                .outerRadius(outerRadius)
                .innerRadius(innerRadius)

            var path = s.selectAll("path")
                .data(pie(data))
                .enter()
                .append("path")
                .attr("class", "paths")
                .attr("d", arc)
                .attr("fill", function(d, i) {
                    return colors(d.data.label);
                })

            var ordinal = d3.scaleOrdinal()
                .domain(data.map(function(d) {
                    return d.label;
                }))
                .range(data.map(function(d) {
                    return colors(d.label);
                }));

            s.append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {
                    return "translate(" + (outerRadius + 10) + "," +
                        (-outerRadius + 10) + ")";
                });
            var legend = d3.legendColor()
                .shape("path", d3.symbol().type(d3.symbolCircle).size(100)())
                .scale(ordinal);
            s.select(".legend")
                .call(legend)
                .style("fill", fillLegend)
                .style("font-size", "90%")

            update = function(first) {
                first = first || false

                // add updatable part of charts here

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

    chart.fillLegend = function(value) {
        if (!arguments.length) return fillLegend
        fillLegend = value;
        return chart;
    }

    chart.colors = function(value) {
        if (!arguments.length) return colors
        colors = value;
        return chart;
    }

    chart.update = function() {
        update()
        return chart
    }

    return chart
}
