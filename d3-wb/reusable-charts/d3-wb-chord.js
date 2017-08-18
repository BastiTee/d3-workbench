function wbChordDiagram() {
    "use strict";

    var width = 500
    var height = 500
    var color = "black"
    var matrix
    var keys
    var colors = d3.scaleOrdinal(d3.schemeCategory20c)

    var update = function() {}

    function chart(selection) {

        selection.each(function() {
            var s = d3.select(this)

            s.attr("transform", "translate(" +
                (width / 2) + "," +
                (height / 2) + ")");

            var innerRadius = height / 2 - 100;

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
                .style("stroke", color)
                .style("fill", color)
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
                .style("fill", color)
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
    
    chart.color = function(value) {
        if (!arguments.length) return color
        color = value;
        return chart;
    }

    return chart
}
