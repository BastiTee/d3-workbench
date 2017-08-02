function reusableChart() {
    var colors = d3.scaleOrdinal(d3.schemeCategory20c)

    function chart(selection) {

        selection.each(function(data, i) {
            var rects = d3.select(this)
                .selectAll("rect")
                .data(data)

            rects.enter().append("rect")
                .merge(rects)
                .transition(d3.transition()
                    .duration(750))
                .attr("x", function(d) {
                    return d.x
                })
                .attr("y", function(d) {
                    return d.y
                })
                .attr("width", function(d) {
                    return d.w
                })
                .attr("height", function(d) {
                    return d.h
                })
                .attr("fill", function(d, i) {
                    return colors(i)
                })
        });
    }

    chart.colors = function(value) {
        if (!arguments.length) return colors;
        colors = value;
        return chart;
    };

    return chart;
}