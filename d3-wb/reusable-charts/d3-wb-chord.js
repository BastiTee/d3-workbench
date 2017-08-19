function wbChordDiagram() {
    "use strict";

    var radius = 500
    var fill = "black"
    var colors = d3.scaleOrdinal(d3.schemeCategory20c)
    var matrix
    var keys

    function chart(selection) {

        selection.each(function() {
            var s = d3.select(this)

            var innerRadius = radius / 2 - 100;

            var chord = d3.chord()
                .padAngle(0.04)
                .sortSubgroups(d3.descending)
                .sortChords(d3.descending);

            var arc = d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(innerRadius + 20);

            var ribbon = d3.ribbon()
                .radius(innerRadius);


            var chords = chord(matrix)
            s
                .attr("class", "chord-circle")
                .datum(chords)

            s.append("circle")
                .attr("fill", "none")
                .attr("pointer-events", "all")
                .attr("r", innerRadius + 20)

            var g = s.selectAll("group")
                .data(function(chords) {
                    return chords.groups;
                })
                .enter().append("g")
                .style("fill-opacity", ".8")
                .on("mouseover", function(d, i) {
                    chordPaths.classed("fade", function(p) {
                        return p.source.index != i &&
                            p.target.index != i;
                    });
                })
                .on("mousemove", function() {})
                .on("mouseout", function() {})
            g.append("path")
                .style("stroke", fill)
                .style("fill", fill)
                .attr("d", arc);

            g.append("text")
                .each(function(d) {
                    d.angle = (d.startAngle + d.endAngle) / 2;
                })
                .attr("dy", ".35em")
                .style("font-size", "90%")
                .attr("text-anchor", function(d) {
                    return d.angle > Math.PI ? "end" : null;
                })
                .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                        "translate(" + (innerRadius + 26) + ")" +
                        (d.angle > Math.PI ? "rotate(180)" : "");
                })
                .style("fill", fill)
                .text(function(d) {
                    return keys[d.index].key
                });

            var chordPaths = s.selectAll("chord")
                .data(function(chords) {
                    return chords;
                })
                .enter().append("path")
                .attr("class", "chordpaths")
                .style("fill-opacity", ".8")
                .style("stroke-width", "25px")
                .style("fill", function(d, i) {
                    return colors(i)
                })
                .attr("d", ribbon.radius(innerRadius))

        })
    }

    chart.radius = function(value) {
        if (!arguments.length) return radius
        radius = value;
        return chart;
    }

    chart.matrix = function(value) {
        if (!arguments.length) return matrix
        matrix = value;
        return chart;
    }

    chart.keys = function(value) {
        if (!arguments.length) return keys
        keys = value;
        return chart;
    }

    chart.colors = function(value) {
        if (!arguments.length) return colors
        colors = value;
        return chart;
    }

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    return chart
}