(function() {
    "use strict";

    d3wb.injectCSS(`
        .chord-circle circle {
            fill: none;
            pointer-events: all;
        }
        .chord-circle:hover path.fade {
            display: none;
        }
    `)

    d3wb.plotChordDiagram = function(data, cv, attr) {

        cv.svg.attr("transform",
            "translate(" + cv.wid / 2 + "," + cv.hei / 2 + ")")

        var mapper = chordMapper(data);
        mapper
            .addValuesToMap(attr.leftSideColumn)
            .addValuesToMap(attr.rightSideColumn)
            .setFilter(function(row, a, b) {
                return (row[attr.leftSideColumn] === a.name &&
                    row[attr.rightSideColumn] === b.name)
            })
            .setAccessor(function(recs, a, b) {
                if (!recs[0]) return 0;
                return +recs[0][attr.countColumn];
            })

        var mapReader = chordReader(
            mapper.getMatrix(), mapper.getMap());

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

        var colors = d3wb.getOrdinalColors()

        var groupTooltip = d3wb.tooltip(cv, {
            selector: function(d) {
                var d1 = mapReader(d)
                return d1.gname + "\n" + d1.gvalue + " samples";
            }
        })
        var pathTooltip = d3wb.tooltip(cv, {
            selector: function(d) {
                var d1 = mapReader(d)
                var p = d3.format(".1%"),
                    q = d3.format(",.2r")
                return d1.sname + " w/ " + d1.tname + "\n" +
                    d1.svalue + " samples\n" +
                    d1.tname + " w/ " + d1.sname + "\n" +
                    d1.tvalue + " samples";
            }
        })

        cv.svg
            .attr("class", "chord-circle")
            .datum(chord(mapper.getMatrix()));


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
                groupTooltip.mouseover(d)
            })
            .on("mousemove", groupTooltip.mousemove)
            .on("mouseout", groupTooltip.mouseout)

        g.append("path")
            .style("stroke", d3.color.foreground)
            .style("fill", function(d) {
                return mapReader(d).gdata;
            })
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
                return mapReader(d).gname;
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
            .on("mouseover", pathTooltip.mouseover)
            .on("mousemove", pathTooltip.mousemove)
            .on("mouseout", pathTooltip.mouseout)

    }


    var chordMapper = function(data) {
        var mpr = {},
            mmap = {},
            n = 0,
            matrix = [],
            filter, accessor;

        mpr.setFilter = function(fun) {
                filter = fun;
                return this;
            },
            mpr.setAccessor = function(fun) {
                accessor = fun;
                return this;
            },
            mpr.getMatrix = function() {
                matrix = [];
                _.each(mmap, function(a) {
                    if (!matrix[a.id]) matrix[a.id] = [];
                    _.each(mmap, function(b) {
                        var recs = _.filter(data, function(row) {
                            return filter(row, a, b);
                        })
                        matrix[a.id][b.id] = accessor(recs, a, b);
                    });
                });
                return matrix;
            },
            mpr.getMap = function() {
                return mmap;
            },
            mpr.addToMap = function(value, info) {
                if (!mmap[value]) {
                    mmap[value] = {
                        name: value,
                        id: n++,
                        data: info
                    }
                }
            },
            mpr.addValuesToMap = function(varName, info) {
                var values = _.uniq(_.pluck(data, varName));
                _.map(values, function(v) {
                    if (!mmap[v]) {
                        mmap[v] = {
                            name: v,
                            id: n++,
                            data: info
                        }
                    }
                });
                return this;
            }
        return mpr;
    }

    var chordReader = function(matrix, mmap) {
        return function(d) {
            var i, j, s, t, g, m = {};
            if (d.source) {
                i = d.source.index;
                j = d.target.index;
                s = _.where(mmap, {
                    id: i
                });
                t = _.where(mmap, {
                    id: j
                });
                m.sname = s[0].name;
                m.sdata = d.source.value;
                m.svalue = +d.source.value;
                m.stotal = _.reduce(matrix[i], function(k, n) {
                    return k + n
                }, 0);
                m.tname = t[0].name;
                m.tdata = d.target.value;
                m.tvalue = +d.target.value;
                m.ttotal = _.reduce(matrix[j], function(k, n) {
                    return k + n
                }, 0);
            } else {
                g = _.where(mmap, {
                    id: d.index
                });
                m.gname = g[0].name;
                m.gdata = g[0].data;
                m.gvalue = d.value;
            }
            m.mtotal = _.reduce(matrix, function(m1, n1) {
                return m1 + _.reduce(n1, function(m2, n2) {
                    return m2 + n2
                }, 0);
            }, 0);
            return m;
        }
    }

})()