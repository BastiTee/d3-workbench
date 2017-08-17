(function() {
    "use strict";

    d3wb.util.injectCSS(`
        .chord-circle circle {
            fill: none;
            pointer-events: all;
        }
        .chord-circle:hover path.fade {
            display: none;
        }
    `)

    d3wb.plotChordDiagram = function(mat, keys, cv, attr) {

        attr = attr || {}
        attr.indicator = attr.indicator || "samples"
        cv.svg.attr("transform",
            "translate(" + (cv.wid / 2 + cv.mar.left) + "," +
            (cv.hei / 2 + cv.mar.top) + ")")

        var innerRadius = cv.hei / 2 - 100;

        var chord = d3.chord()
            .padAngle(0.04)
            .sortSubgroups(d3.descending)
            .sortChords(d3.descending);

        var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(innerRadius + 20);

        var ribbon = d3.ribbon()
            .radius(innerRadius);

        var colors = d3wb.color.ordinal()

        var chords = chord(mat)
        cv.svg
            .attr("class", "chord-circle")
            .datum(chords)

        cv.svg.append("circle")
            .attr("r", innerRadius + 20)

        var g = cv.svg.selectAll("group")
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
            .style("stroke", d3.color.foreground)
            .style("fill", d3wb.color.foreground)
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
            .style("fill", d3wb.color.foreground)
            .text(function(d) {
                return keys[d.index].key
            });

        var chordPaths = cv.svg.selectAll("chord")
            .data(function(chords) {
                return chords;
            })
            .enter().append("path")
            .style("fill-opacity", ".8")
            .style("stroke-width", "25px")
            .style("fill", function(d, i) {
                return colors(i)
            })
            .attr("d", ribbon.radius(innerRadius))
            .call(wbCooltip().selector(function(d) {
                return keys[d.source.index].key + " w/ " 
                    + keys[d.source.subindex].key + "\n"
                    + d.source.value
                    

            }))
    }

})()