function wbWordCloud() {
    "use strict";

    var width = 500
    var height = 500
    var colorRange = ["green", "green"]

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            data.forEach(function(d) {
                d.fontsize = +d.textrank * 10000
            });
            var minMax = d3.extent(data, function(d) {
                return d.textrank
            })
            var fgColors = d3.scaleLinear().domain(minMax)
                .interpolate(d3.interpolate)
                .range(colorRange);

            d3.layout.cloud().size([width, height])
                .words(data)
                .padding(1)
                .rotate(0)
                .font("Roboto Condensed")
                .fontSize(function(d) {
                    return d.fontsize;
                })
                .on("end", function(data) {
                    s.attr("transform", "translate(" +
                        (width / 2) + "," +
                        (height / 2) + ")");

                    var cloud = s.selectAll("text")
                        .data(data, function(d) {
                            return d.text;
                        })

                    cloud.enter()
                        .append("text")
                        .style("fill", function(d) {
                            return fgColors(d.textrank);
                        })
                        .attr("text-anchor", "middle")
                        .attr('font-size', function(d) {
                            return d.size + "px";
                        })
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function(d) {
                            return d.text;
                        });

                    cloud.exit().remove();

                }).start();
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

    chart.colorRange = function(value) {
        if (!arguments.length) return colorRange
        colorRange = value;
        return chart;
    }

    return chart
}
