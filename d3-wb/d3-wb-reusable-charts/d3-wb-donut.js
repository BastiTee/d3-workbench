function wbDonutChart() {
    "use strict";

    var radius = 500
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

            var outerRadius = radius / 2;
            var innerRadius = radius / 8;

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
                    return colors(i);
                })

            var ordinal = d3.scaleOrdinal()
                .domain(data.map(function(d) {
                    return d.label;
                }))
                .range(data.map(function(d, i) {
                    return colors(i);
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

        })
    }

    chart.radius = function(value) {
        if (!arguments.length) return radius
        radius = value;
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

    return chart
}