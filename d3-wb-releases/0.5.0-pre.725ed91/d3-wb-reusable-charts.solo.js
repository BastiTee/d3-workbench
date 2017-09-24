function wbBarChart() {
    "use strict";

    var width = 500
    var height = 500
    var padding = 0.1
    var widthFactor = 1.0
    var xSelector = "x"
    var ySelector = "y"
    var scaleX
    var scaleY
    var yExtent
    var valuesShow
    var valuesFill = "black"
    var valuesPadding = 10
    var valueFormat = function(v) {
        return v
    }
    var fill = "blue"
    var update = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            data.forEach(function(d) {
                d[ySelector] = +d[ySelector]
            })

            scaleX = d3
                .scaleBand()
                .rangeRound([0, width], .1)
                .padding(padding)
                .domain(data.map(function(d) {
                    return d[xSelector]
                }))

            if (!yExtent) {
                yExtent = [0, d3.max(data, function(d) {
                    return d[ySelector];
                })]
            }

            scaleY = d3.scaleLinear()
                .range([height, 0])
                .domain(yExtent)

            update = function(data) {
                s.selectAll(".rects")
                    .remove()
                    .exit()
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "rects")
                    .attr("x", function(d) {
                        if (widthFactor >= 1) {
                            return scaleX(d[xSelector])
                        } else {
                            var diff = scaleX.bandwidth() - 
                             scaleX.bandwidth()*widthFactor
                            return scaleX(d[xSelector]) + diff/2
                        }
                    })
                    .attr("width", function(d) {
                        return scaleX.bandwidth()*widthFactor
                    })
                    .attr("y", function(d) {
                        return scaleY(d[ySelector]);
                    })
                    .attr("height", function(d) {
                        return height - scaleY(d[ySelector]);
                    })
                    .attr("fill", function(d, i) {
                        if (typeof fill === "string") {
                            return fill
                        } else if (typeof fill === "function") {
                            return fill(i)
                        } else {
                            return fill[i]
                        }
                    })

                if (!valuesShow) {
                    return;
                }

                var values = s.selectAll(".values")
                    .remove()
                    .exit()
                    .data(data)
                    .enter().append("text")
                    .attr("class", "values")
                    .attr("fill", valuesFill)
                    .attr("text-anchor", "middle")
                    .attr("x", function(d) {
                        return scaleX(d[xSelector]) + scaleX.bandwidth() / 2
                    })
                    .attr("y", function(d) {
                        return scaleY(d[ySelector]) - valuesPadding
                    })
                    .text(function(d) {
                        return valueFormat(d[ySelector])
                    })
            }
            update(data)

        })
    }

    chart.update = function(data) {
        update(data)
        return chart
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

    chart.yExtent = function(value) {
        if (!arguments.length) return yExtent
        yExtent = value;
        return chart;
    }

    chart.valuesShow = function(value) {
        if (!arguments.length) return valuesShow
        valuesShow = value;
        return chart;
    }

    chart.valuesFill = function(value) {
        if (!arguments.length) return valuesFill
        valuesFill = value;
        return chart;
    }

    chart.valueFormat = function(value) {
        if (!arguments.length) return valueFormat
        valueFormat = value;
        return chart;
    }

    chart.padding = function(value) {
        if (!arguments.length) return padding
        padding = value;
        return chart;
    }
    
    chart.widthFactor = function(value) {
        if (!arguments.length) return widthFactor
        widthFactor = value;
        return chart;
    }

    return chart
};
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
};
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
};
function wbGeoMap() {
    "use strict";
    // Inspired by: http://bl.ocks.org/oscar6echo/4423770

    var width = 500
    var height = 500
    var mapFill = "#666666"
    var mapStroke = "#555555"
    var dotFill = "#5A6A8B"
    var dotStroke = "#4e5c79"
    var radius = 2
    var mapData
    var projection

    function chart(selection) {

        var focused
        var geoPath

        selection.each(function(data, i) {
            var s = d3.select(this)

            var applyZoom = function(d) {
                var x = width / 2
                var y = height / 2
                var k = 1

                if ((focused === null) || !(focused === d)) {
                    var centroid = geoPath.centroid(d),
                        x = +centroid[0],
                        y = +centroid[1],
                        k = 2.5;
                    focused = d;
                } else {
                    focused = null;
                };

                s.transition()
                    .duration(1000)
                    .attr("transform", "translate(" + (width / 2) + "," +
                        (height / 2) + ")scale(" + k + ")translate(" + (-x) + "," +
                        (-y) + ")")
                    .style("stroke-width", 1.75 / k + "px");
            }

            var resetZoom = function() {
                focused = null;
                s.transition()
                    .duration(500)
                    .attr("transform",
                        "scale(" + 1 + ")translate(" + 0 + "," + 0 + ")")
                    .style("stroke-width", 1.00 + "px");
            }

            var bounds = d3.geoBounds(mapData)
            var bottomLeft = bounds[0]
            var topRight = bounds[1]
            var rotLong = -(topRight[0] + bottomLeft[0]) / 2
            var center = [(topRight[0] + bottomLeft[0]) / 2 +
                rotLong, (topRight[1] + bottomLeft[1]) / 2
            ]

            projection = d3.geoAlbers()
                .parallels([bottomLeft[1], topRight[1]])
                .translate([width / 2, height / 2])
                .rotate([rotLong, 0, 0])
                .center(center);

            var bottomLeftPx = projection(bottomLeft)
            var topRightPx = projection(topRight)
            var scaleFactor = 1.00 * Math.min(width / (topRightPx[0] -
                bottomLeftPx[0]), height / (-topRightPx[1] + bottomLeftPx[1]))
            projection = d3.geoAlbers()
                .parallels([bottomLeft[1], topRight[1]])
                .rotate([rotLong, 0, 0])
                .translate([width / 2, height / 2])
                .scale(scaleFactor * 0.975 * 1000)
                .center(center);

            geoPath = d3.geoPath().projection(projection);

            s.selectAll("path.feature")
                .data(mapData.features)
                .enter()
                .append("path")
                .attr("d", geoPath)
                .style("fill", mapFill)
                .style("stroke", mapStroke)
                .style("stroke-width", 1)
                .on("click", applyZoom)

            var pts = s.selectAll("circle")
                .data(data)
                .enter()
                .append("circle")
                .attr("transform", function(d) {
                    var p = projection([d['lon'], d['lat']])
                    return "translate(" + p + ")"
                })
                .style("stroke", dotStroke)
                .style("stroke-width", "0.4")
                .attr("opacity", 0.9)
                .style("fill", dotFill)

            /* highlight long - distance stations */
            pts.transition().delay(500).duration(1000)
                .attr("r", radius)

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

    chart.mapData = function(value) {
        if (!arguments.length) return mapData
        mapData = value;
        return chart;
    }

    chart.projection = function(value) {
        if (!arguments.length) return projection
        projection = value;
        return chart;
    }


    chart.mapFill = function(value) {
        if (!arguments.length) return mapFill
        mapFill = value;
        return chart;
    }

    chart.mapStroke = function(value) {
        if (!arguments.length) return mapStroke
        mapStroke = value;
        return chart;
    }

    chart.dotFill = function(value) {
        if (!arguments.length) return dotFill
        dotFill = value;
        return chart;
    }

    chart.dotStroke = function(value) {
        if (!arguments.length) return dotStroke
        dotStroke = value;
        return chart;
    }

    chart.radius = function(value) {
        if (!arguments.length) return radius
        radius = value;
        return chart;
    }

    return chart
};
function wbHeatMap() {
    "use strict";

    var width = 500
    var height = 500
    var fill = "black"
    var colors = ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb",
        "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"
    ]

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            data.forEach(function(d) {
                d.day = +d.day
                d.hour = +d.hour
                d.value = +d.value
            });

            var numHours = 24
            var times = Array(numHours)
            for (var i = 0; i < times.length; i++) {
                times[i] = i + "";
            }
            var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

            var gridSizeX = Math.floor(width / numHours);
            var gridSizeY = Math.floor(height / days.length);

            var dayLabels = s.selectAll(".dayLabel")
                .data(days)
                .enter().append("text")
                .text(function(d) {
                    return d;
                })
                .attr("x", 0)
                .attr("y", function(d, i) {
                    return i * gridSizeY;
                })
                .style("text-anchor", "end")
                .style("fill", fill)
                .attr("alignment-baseline", "middle")
                .attr("transform", "translate(-6," + gridSizeY / 2 + ")")

            var timeLabels = s.selectAll(".timeLabel")
                .data(times)
                .enter().append("text")
                .text(function(d) {
                    return d;
                })
                .attr("x", function(d, i) {
                    return i * gridSizeX;
                })
                .attr("y", 0)
                .style("text-anchor", "middle")
                .style("fill", fill)
                .attr("transform", "translate(" + gridSizeX / 2 + ", -6)")

            var heatMap = s.selectAll(".hour")
                .data(data)
                .enter().append("rect")
                .attr("x", function(d) {
                    return (d.hour) * gridSizeX;
                })
                .attr("y", function(d) {
                    return (d.day - 1) * gridSizeY;
                })
                .attr("class", "hour bordered")
                .attr("width", gridSizeX)
                .attr("height", gridSizeY)
                .attr("stroke", fill)
                .attr("stroke-width", "1")
                .style("fill", fill)

            var minMax = d3.extent(data, function(d) {
                return d.value;
            })
            var colorScale = d3.scaleQuantile()
                .domain(minMax)
                .range(colors);

            heatMap.style("fill", function(d) {
                return colorScale(d.value);
            });

            var legend = s.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) {
                    return d;
                })
                .enter().append("g")

            legend.append("rect")
                .attr("x", function(d, i) {
                    return gridSizeX * 2 * i;
                })
                .attr("y", height + 10)
                .attr("width", gridSizeX * 2)
                .attr("height", gridSizeY / 2)
                .attr("stroke", fill)
                .attr("stroke-width", "1")
                .style("fill", function(d, i) {
                    return colors[i];
                });

            legend.append("text")
                .attr("alignment-baseline", "hanging")
                .text(function(d) {
                    return "≥ " + Math.round(d);
                })
                .attr("x", function(d, i) {
                    return gridSizeX * 2 * i;
                })
                .attr("y", height + gridSizeY)
                .style("fill", fill)
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
};
function wbLinePlot() {
    "use strict";

    var width = 500
    var height = 500
    var xAxisScale = d3.scaleLinear()
    var yAxisScale = d3.scaleLinear()
    var xDataPoints = "x"
    var yDataPoints = "y"
    var scaleX;
    var scaleY;
    var xMinMax;
    var yMinMax;
    var stroke = "red"
    var axisColor = "white"
    var curve = d3.curveBasis
    var update = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            s.append("path").attr("class", "line")

            update = function(data) {

                if (xMinMax === undefined) {
                    xMinMax = d3.extent(data, function(d) {
                        return d[xDataPoints];
                    })
                }
                if (yMinMax === undefined) {
                    yMinMax = d3.extent(data, function(d) {
                        return d[yDataPoints];
                    })
                }
                scaleX = xAxisScale.rangeRound([0, width]).domain(xMinMax);
                scaleY = yAxisScale.rangeRound([height, 0]).domain(yMinMax);
                var line = d3.line()
                    .curve(curve)
                    .x(function(d) {
                        return scaleX(d[xDataPoints]);
                    })
                    .y(function(d) {
                        return scaleY(d[yDataPoints]);
                    })

                var c = s.selectAll(".line")
                    .transition().duration(500)
                    .attr("d", line(data))
                    .style("fill", "none")
                    .style("stroke-linecap", "round")
                    .style("stroke-linejoin", "round")
                    .style("stroke-width", "1")
                    .style("stroke", stroke)

            }
            update(data)

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

    chart.xAxisScale = function(value) {
        if (!arguments.length) return xAxisScale
        xAxisScale = value;
        return chart;
    }

    chart.yAxisScale = function(value) {
        if (!arguments.length) return yAxisScale
        yAxisScale = value;
        return chart;
    }

    chart.xDataPoints = function(value) {
        if (!arguments.length) return xDataPoints
        xDataPoints = value;
        return chart;
    }

    chart.yDataPoints = function(value) {
        if (!arguments.length) return yDataPoints
        yDataPoints = value;
        return chart;
    }

    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor
        axisColor = value;
        return chart;
    }

    chart.stroke = function(value) {
        if (!arguments.length) return stroke
        stroke = value;
        return chart;
    }

    chart.curve = function(value) {
        if (!arguments.length) return curve
        curve = value;
        return chart;
    }

    chart.scaleX = function() {
        return scaleX;
    }

    chart.scaleY = function() {
        return scaleY;
    }

    chart.update = function(data) {
        update(data)
        return chart
    }
    
    chart.xMinMax = function(value) {
        if (!arguments.length) return xMinMax
        xMinMax = value;
        return chart;
    }
    
    chart.yMinMax = function(value) {
        if (!arguments.length) return yMinMax
        yMinMax = value;
        return chart;
    }

    return chart
};
function wbNetworkDiagram() {
    "use strict";

    var width = 500
    var height = 500
    var fill = "black"
    var legend;
    var collide = 0.5
    var thicknessRange = [1, 20]
    var colors = d3.scaleOrdinal(["red", "green", "blue"])

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            if (legend === undefined) {
                var arr = []
                data.nodes.forEach(function(d) {
                    arr.push(d.group)
                })
                var set = Array.from(new Set(arr.sort()))
                legend = []
                for (var i in set) {
                    legend.push([set[i], colors(set[i])])
                }
            }

            var radius = d3.scaleLinear().domain(
                d3.extent(data.nodes, function(d) {
                    return d.weight
                })).range([5, 20])

            data.nodes.forEach(function(d) {
                d.r = radius(d.weight);
            })

            var minMax2 = d3.extent(data.links, function(d) {
                return d.value
            })
            var thick = d3.scaleLinear().domain(minMax2).range(thicknessRange)

            var simulation = d3.forceSimulation()
                .force("link", d3.forceLink().id(function(d) {
                    return d.id;
                }))
                .force("charge", d3.forceManyBody())
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("x", d3.forceX(width).strength(0.06))
                .force("y", d3.forceY(height).strength(0.06))
                .force("collide", d3.forceCollide().radius(function(d) {
                    return d.r + collide;
                }).iterations(4))

            var link = s.append("g")
                .selectAll("line")
                .data(data.links)
                .enter().append("line")
                .attr("stroke-width", function(d) {
                    return thick(d.value)
                })
                .style("stroke", fill)
                .style("stroke-opacity", "0.6")

            var node = s.append("g")
                .selectAll("circle")
                .data(data.nodes)
                .enter().append("circle")
                .attr("class", "circles")
                .attr("r", function(d) {
                    return d.r
                })
                .attr("fill", function(d) {
                    return colors(d.group);
                })
                .style("stroke", fill)
                .style("stroke-width", "1")
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            simulation
                .nodes(data.nodes)
                .on("tick", ticked);
            simulation.force("link")
                .links(data.links);


            var legendG = s.append("g")
                .attr("font-size", "75%")
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(legend)
                .enter().append("g")
                .attr("transform", function(d, i) {
                    return "translate(0," + (i * 20 + 10) + ")";
                });

            legendG.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", function(d) {
                    return d[1]
                });

            legendG.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .attr("fill", fill)
                .text(function(d) {
                    return d[0];
                });

            function ticked() {
                link
                    .attr("x1", function(d) {
                        return d.source.x;
                    })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });
                node
                    .attr("cx", function(d) {
                        return d.x;
                    })
                    .attr("cy", function(d) {
                        return d.y;
                    });
            }

            function dragstarted(d) {
                if (!d3.event.active) simulation.alphaTarget(0.5).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(d) {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            }

            function dragended(d) {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }
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

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    chart.legend = function(value) {
        if (!arguments.length) return legend
        legend = value;
        return chart;
    }

    chart.colors = function(value) {
        if (!arguments.length) return colors
        colors = value;
        return chart;
    }
    
    chart.collide = function(value) {
        if (!arguments.length) return collide
        collide = value;
        return chart;
    }
    
    chart.thicknessRange = function(value) {
        if (!arguments.length) return thicknessRange
        thicknessRange = value;
        return chart;
    }

    return chart
};
function wbNumericHistogram() {
    "use strict";

    var width = 500
    var height = 500
    var barColor = "red"
    var axisColor = "white"
    var numBins = 50
    var updateCallback = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var sel = d3.select(this)
            var xMinMaxNew;
            var xMinMax = d3.extent(data, function(d) {
                return d.value
            })
            var x = d3.scaleLinear().rangeRound([0, width])
            var t = sel.transition().duration(750);
            var y = d3.scaleLinear().rangeRound([height, 0]);
            var xAxis = d3.axisBottom(x)
            var yAxis = d3.axisLeft(y)


            var brush = d3.brushX()
                .extent([
                    [0, 0],
                    [width, height]
                ])
                .on("end", brushed)
            var clickTimeout = null
            var clickDelay = 350;
            var brushgroup = sel.append("g")
                .attr("class", "brush")
                .call(brush);
            var rectg = sel.append("g")
            sel.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis axis-x")
            sel.append("g")
                .attr("class", "axis axis-y")
                
            draw(xMinMax)

            function draw(xMinMax) {
                x.domain(xMinMax)
                var bins = d3.histogram()
                    .value(function(d) {
                        return d.value
                    })
                    .domain(x.domain())
                    .thresholds(x.ticks(numBins))
                    (data);

                var yMinMax = d3.extent(bins, function(d) {
                    return d.length
                })
                y.domain(yMinMax)

                var rects = rectg.selectAll(".bar")
                    .remove()
                    .exit()
                    .data(bins)

                rects.enter().append("rect")
                    .attr("class", "bar")
                    .attr("fill", barColor)
                    .attr("width", function(d, i) {
                        var wid = width / bins.length
                        var pad = wid * 0.1
                        wid = wid - pad
                        return wid
                    })
                    .attr("height", function(d) {
                        return height - y(d.length);
                    })
                    .attr("y", function(d) {
                        return y(d.length)
                    })
                    .transition(t)
                    .attr("x", function(d) {
                        return x(d.x0)
                    })

                sel.select(".axis-x").transition(t).call(xAxis);
                sel.select(".axis-y").transition(t).call(yAxis);

                sel.selectAll(".axis line")
                    .attr("stroke", axisColor)
                sel.selectAll(".axis path")
                    .attr("stroke", axisColor)
                sel.selectAll(".axis text")
                    .attr("fill", axisColor)

                updateCallback()

            }

            function brushed() {
                var s = d3.event.selection; // get selection.. 
                if (!s) { // if selection is empty ...
                    // if not active, set a timeout and return...
                    if (!clickTimeout) {
                        return clickTimeout = setTimeout(notClicked, clickDelay)
                    }
                    // if click timeout not reached, then reset x selection
                    xMinMaxNew = xMinMax
                } else {
                    // get min max values corresponding to current selection
                    xMinMaxNew = [
                        x.invert(s[0]) < xMinMax[0] ?
                        xMinMax[0] : x.invert(s[0]),
                        x.invert(s[1]) > xMinMax[1] ?
                        xMinMax[1] : x.invert(s[1])
                    ]
                    sel.select(".brush").call(brush.move, null);
                }
                brushedEnd();
            }

            function notClicked() {
                clickTimeout = null;
            }

            function brushedEnd() {
                draw(xMinMaxNew)
            }
        })

    }

    chart.height = function(value) {
        if (!arguments.length) return height
        height = value;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return width
        width = value;
        return chart;
    }

    chart.barColor = function(value) {
        if (!arguments.length) return barColor
        barColor = value;
        return chart;
    }

    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor
        axisColor = value;
        return chart;
    }

    chart.numBins = function(value) {
        if (!arguments.length) return numBins
        numBins = value;
        return chart;
    }
    
    chart.updateCallback = function(value) {
        if (!arguments.length) return updateCallback
        updateCallback = value;
        return chart;
    }

    return chart
};
function wbPackedBubbles() {
    "use strict";

    var width = 500
    var height = 500
    var colorRange = ["green", "white"]
    var fillRange = ["green", "red" ]
    var fadeOpacity
    
    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var minMax = d3.extent(data, function(d) {
                return d.value
            })
            
            var fgColors = d3.scaleLinear().domain(minMax)
                .interpolate(d3.interpolate)
                .range(colorRange);
            var bgColors = d3.scaleLinear().domain(minMax)
            .interpolate(d3.interpolate)
            .range(fillRange);
            
            if (fadeOpacity) {
                var opScale = d3.scaleLog().domain(minMax)
                    .range(fadeOpacity);
            }

            var pack = d3.pack()
                .size([width, height])
                .padding(0.3);

            var root = d3.hierarchy({
                    children: data
                })
                .sum(function(d) {
                    return d.value;
                })

            var nodes = s.selectAll("node")
                .data(pack(root).leaves())
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });


            nodes
                .append("a").attr("xlink:href", function(d) {
                    return d.data.link
                })
                .append("circle")
                .attr("class", "circles")
                .attr("id", function(d) {
                    return d.id;
                })
                .transition().duration(500)
                .attr("r", function(d) {
                    return d.r;
                })
                .style("fill", function(d) {
                    return bgColors(d.value)
                })
                .style("opacity", function(d) {
                    if (fadeOpacity) {
                        return opScale(d.value)
                    }
                    return "1.0";
                })            

            nodes
                .append("a").attr("xlink:href", function(d) {
                    return d.data.link
                })
                .append("text")
                .attr("class", "texts")
                .style("font-size", "10px")
                .style("text-anchor", "middle")
                .style("alignment-baseline", "middle")
                .attr("x", 0)
                .attr("y", 0)
                .text(function(d) {
                    return d.data.id
                })
                .style("font-size", function(d) {
                    return ((2 * d.r - 10) / this.getComputedTextLength() * 10) + "px";
                })
                .style("opacity", function(d) {
                    if (fadeOpacity) {
                        return opScale(d.value)
                    }
                    return "1.0";
                })
                .transition().duration(1000)
                .style("fill", function(d) {
                    return fgColors(d.value)
                })
                
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
    
    chart.fillRange = function(value) {
        if (!arguments.length) return fillRange
        fillRange = value;
        return chart;
    }

    chart.fadeOpacity = function(value) {
        if (!arguments.length) return fadeOpacity
        fadeOpacity = value;
        return chart;
    }

    return chart
}
;
function wbSankeyDiagram() {
    "use strict";

    var width = 500
    var height = 500
    var fill = "black"
    var colors = d3.scaleOrdinal(d3.schemeCategory20c)

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var formatNumber = d3.format(",.0f"),
                format = function(d) {
                    return formatNumber(d) + " TWh";
                }

            var sankey = d3.sankey()
                .nodeWidth(15)
                .nodePadding(10)
                .size([width, height]);

            var path = sankey.link();
            sankey
                .nodes(data.nodes)
                .links(data.links)
                .layout(32);

            var link = s.selectAll(".sankey-link")
                .data(data.links)
                .enter().append("path")
                .attr("class", "sankey-link")
                .style("fill", "none")
                .style("stroke", fill)
                .style("stroke-opacity", .2)
                .attr("d", path)
                .style("stroke-width", function(d) {
                    return Math.max(1, d.dy);
                })
                .sort(function(a, b) {
                    return b.dy - a.dy;
                });

            link.append("title")
                .text(function(d) {
                    return d.source.name + " → " + d.target.name + "\n" + format(d.value);
                });

            var node = s.selectAll(".sankey-node")
                .data(data.nodes)
                .enter().append("g")
                .attr("class", "sankey-node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .call(d3.drag()
                    .subject(function(d) {
                        return d;
                    })
                    .on("start", function() {
                        this.parentNode.appendChild(this);
                    })
                    .on("drag", dragmove));

            node.append("rect")
                .style("cursor", "move")
                .style("shape-rendering", "crispEdges")
                .attr("height", function(d) {
                    return d.dy;
                })
                .attr("width", sankey.nodeWidth())
                .style("fill", function(d) {
                    return d.color = colors(d.name.replace(/ .*/, ""));
                })
                .style("stroke", function(d) {
                    return fill
                })
                .append("title")
                .text(function(d) {
                    return d.name + "\n" + format(d.value);
                });

            node.append("text")
                .attr("x", -6)
                .attr("y", function(d) {
                    return d.dy / 2;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "end")
                .attr("fill", fill)
                .attr("transform", null)
                .text(function(d) {
                    return d.name;
                })
                .filter(function(d) {
                    return d.x < width / 2;
                })
                .attr("x", 6 + sankey.nodeWidth())
                .attr("text-anchor", "start");

            function dragmove(d) {
                d3.select(this).attr("transform", "translate(" + d.x + "," + (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) + ")");
                sankey.relayout();
                link.attr("d", path);
            }
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

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    chart.colors = function(value) {
        if (!arguments.length) return colors
        colors = value;
        return chart;
    }

    return chart
};
function wbScatterPlot() {
    "use strict";

    var width = 500
    var height = 500
    var xAxisScale = d3.scaleLinear()
    var yAxisScale = d3.scaleLinear()
    var zAxisScale = d3.scaleLinear()
    var colorLow = "green"
    var colorHigh = "red"
    var xDataPoints = "x"
    var yDataPoints = "y"
    var zDataPoints = "x"
    var axisColor = "white"
    var href = function() {
        return undefined
    }
    var opacityDataPoints = undefined
    var opacityRange = [0.0, 1.0]
    var formatXAxis = function(xAxis) {
        return xAxis;
    }
    var formatYAxis = function(yAxis) {
        return yAxis;
    }
    var update = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)
            var rsize = 8

            var xMinMax = d3.extent(data, function(d) {
                return d[xDataPoints];
            })
            var yMinMax = d3.extent(data, function(d) {
                return d[yDataPoints];
            })
            var zMinMax = d3.extent(data, function(d) {
                return d[zDataPoints];
            })

            s.selectAll(".datapoint")
                .data(data).enter()
                .append("a").attr("xlink:href", href)
                .append("rect")
                .attr("class", "datapoint")
                .attr("width", rsize)
                .attr("height", rsize)
                .attr("rx", 5)

            s.append("g")
                .attr("class", "axis axis-x")
                .attr("transform", "translate(0," + height + ")")
            s.append("g").attr("class", "axis axis-y")
            var x, y, z, o, xAxis, yAxis

            update = function(first) {
                first = first || false

                if (opacityDataPoints !== undefined) {
                    o = d3.scaleLog()
                        .domain(d3.extent(data, function(d) {
                            return d[opacityDataPoints];
                        })).range(opacityRange)
                }
                x = xAxisScale.range([0, width]).domain(xMinMax);
                y = yAxisScale.range([height, 0]).domain(yMinMax);
                z = zAxisScale.domain(zMinMax)
                    .interpolate(d3.interpolate)
                    .range([colorLow, colorHigh]);
                yAxis = d3.axisLeft(y)
                formatYAxis(yAxis)
                xAxis = d3.axisBottom(x)
                formatXAxis(xAxis)

                s.select(".axis-x").transition().duration(500).call(xAxis)
                s.select(".axis-y").transition().duration(500).call(yAxis)

                s.selectAll(".axis line")
                    .attr("stroke", axisColor)
                s.selectAll(".axis path")
                    .attr("stroke", axisColor)
                s.selectAll(".axis text")
                    .attr("fill", axisColor)

                var up;
                if (first) {
                    up = s.selectAll(".datapoint")
                } else {
                    up = s.selectAll(".datapoint")
                        .transition().duration(500)
                }

                up.attr("opacity", function(d) {
                        if (opacityDataPoints !== undefined) {
                            return o(d[opacityDataPoints])
                        }
                        return 1.0
                    })
                    .attr("x", function(d) {
                        return x(d[xDataPoints]) - rsize / 2
                    })
                    .attr("y", function(d) {
                        return y(d[yDataPoints]) - rsize / 2
                    })
                    .style("fill", function(d) {
                        return z(d[zDataPoints])
                    })
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

    chart.xAxisScale = function(value) {
        if (!arguments.length) return xAxisScale
        xAxisScale = value;
        return chart;
    }

    chart.yAxisScale = function(value) {
        if (!arguments.length) return yAxisScale
        yAxisScale = value;
        return chart;
    }

    chart.zAxisScale = function(value) {
        if (!arguments.length) return zAxisScale
        zAxisScale = value;
        return chart;
    }

    chart.xDataPoints = function(value) {
        if (!arguments.length) return xDataPoints
        xDataPoints = value;
        return chart;
    }

    chart.yDataPoints = function(value) {
        if (!arguments.length) return yDataPoints
        yDataPoints = value;
        return chart;
    }

    chart.zDataPoints = function(value) {
        if (!arguments.length) return zDataPoints
        zDataPoints = value;
        return chart;
    }

    chart.opacityDataPoints = function(value) {
        if (!arguments.length) return opacityDataPoints
        opacityDataPoints = value;
        return chart;
    }

    chart.opacityRange = function(value) {
        if (!arguments.length) return opacityRange
        opacityRange = value;
        return chart;
    }

    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor
        axisColor = value;
        return chart;
    }

    chart.colorLow = function(value) {
        if (!arguments.length) return colorLow
        colorLow = value;
        return chart;
    }

    chart.colorHigh = function(value) {
        if (!arguments.length) return colorHigh
        colorHigh = value;
        return chart;
    }

    chart.href = function(value) {
        if (!arguments.length) return href
        href = value;
        return chart;
    }

    chart.formatXAxis = function(value) {
        if (!arguments.length) return formatXAxis
        formatXAxis = value;
        return chart;
    }

    chart.formatYAxis = function(value) {
        if (!arguments.length) return formatYAxis
        formatYAxis = value;
        return chart;
    }

    chart.update = function() {
        update()
        return chart
    }

    return chart
};
function wbStackedBarChart() {
    "use strict";

    var width = 500
    var height = 500
    var xSelector = "x"
    var ySelector = "y"
    var colors = ["red", "green", "blue"]
    var legendFill = "black"
    var scaleX
    var scaleY

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            data.forEach(function(d, i) {
                var keys = Object.keys(d)
                d.total = 0
                for (i = 1; i < keys.length; ++i) {
                    d.total += d[keys[i]] = +d[keys[i]];
                }
            })

            scaleX = d3.scaleBand()
                .rangeRound([0, width])
                .paddingInner(0.05)
                .align(0.1);

            scaleY = d3.scaleLinear()
                .rangeRound([height, 0]);

            var scaleZ = d3.scaleOrdinal()
                .range(colors);

            var keys = data.columns.slice(1);

            data.sort(function(a, b) {
                return b.total - a.total;
            });
            scaleX.domain(data.map(function(d) {
                return d.id;
            }));
            scaleY.domain([0, d3.max(data, function(d) {
                return d.total;
            })]).nice();
            scaleZ.domain(keys);

            s.append("g")
                .selectAll("g")
                .data(d3.stack().keys(keys)(data))
                .enter().append("g")
                .attr("fill", function(d) {
                    return scaleZ(d.key);
                })
                .selectAll("rect")
                .data(function(d) {
                    return d;
                })
                .enter().append("rect")
                .attr("class", "rects")
                .attr("x", function(d) {
                    return scaleX(d.data.id);
                })
                .attr("y", function(d) {
                    return scaleY(d[1]);
                })
                .attr("height", function(d) {
                    return scaleY(d[0]) - scaleY(d[1]);
                })
                .attr("width", scaleX.bandwidth())

            var legend = s.append("g")
                .attr("font-size", "75%")
                .attr("text-anchor", "end")
                .selectAll("g")
                .data(keys.slice())
                .enter().append("g")
                .attr("transform", function(d, i) {
                    return "translate(0," + i * 20 + ")";
                });

            legend.append("rect")
                .attr("x", width - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", scaleZ);

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9.5)
                .attr("dy", "0.32em")
                .text(function(d) {
                    return d;
                })
                .attr("fill", legendFill)
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

    chart.colors = function(value) {
        if (!arguments.length) return colors
        colors = value;
        return chart;
    }

    chart.legendFill = function(value) {
        if (!arguments.length) return legendFill
        legendFill = value;
        return chart;
    }

    return chart
};
function wbStaticNumbers() {
    "use strict";

    var width = 500
    var height = 500
    var fillNumber = "black"
    var fillLabel = "red"

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var columnWid = width / data.length
            var columnPad = width / 20;
            var labelDownwardPercent = 0.2

            s.selectAll("number-value")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d, i) {
                    return (i * columnWid) + (columnPad / 2);
                })
                .attr("y", height)
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "baseline")
                .attr("fill", fillNumber)
                .style("font-size", "20")
                .style("font-weight", "bold")
                .text(function(d) {
                    return d.value
                })
                .style("font-size", function(d) {
                    var newFs = (columnWid - columnPad) / this.getComputedTextLength() * 20
                    return newFs;
                })
                .each(function(d) {
                    d.numberBox = this.getBBox()
                })

            s.selectAll("number-label")
                .data(data)
                .enter()
                .append("text")
                .text(function(d) {
                    return d.name;
                })
                .attr("x", function(d, i) {
                    return (i * columnWid) + (columnPad / 2);
                })
                .attr("y", function(d) {
                    return height - d.numberBox.height + (labelDownwardPercent * d.numberBox.height)
                })
                .attr("text-anchor", "left")
                .attr("fill", fillLabel)
                .style("font-size", "20")
                .text(function(d) {
                    return d.label
                })
                .style("font-size", function(d) {
                    var newFs = (columnWid - columnPad) / this.getComputedTextLength() * 20
                    return newFs;
                })
                .each(function(d) {
                    d.numberBox = this.getBBox()
                });
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

    chart.fillNumber = function(value) {
        if (!arguments.length) return fillNumber
        fillNumber = value;
        return chart;
    }

    chart.fillLabel = function(value) {
        if (!arguments.length) return fillLabel
        fillLabel = value;
        return chart;
    }

    return chart
};
function wbTimeseries() {
    "use strict";

    // %a - abbreviated weekday name.*
    // %c - the locale’s date and time, such as %x, %X.*
    // %b - abbreviated month name.*
    // %A - full weekday name.*
    // %B - full month name.*
    // %d - zero-padded day of the month as a decimal number [01,31].
    // %e - space-padded day of the month as a decimal number [ 1,31];
    // %H - hour (24-hour clock) as a decimal number [00,23].
    // %I - hour (12-hour clock) as a decimal number [01,12].
    // %j - day of the year as a decimal number [001,366].
    // %m - month as a decimal number [01,12].
    // %M - minute as a decimal number [00,59].
    // %L - milliseconds as a decimal number [000, 999].
    // %p - either AM or PM.*
    // %S - second as a decimal number [00,61].
    // %U - Sunday-based week of the year as a decimal number [00,53].
    // %w - Sunday-based weekday as a decimal number [0,6].
    // %W - Monday-based week of the year as a decimal number [00,53].
    // %x - the locale’s date, such as %-m/%-d/%Y.*
    // %X - the locale’s time, such as %-I:%M:%S %p.*
    // %y - year without century as a decimal number [00,99].
    // %Y - year with century as a decimal number.
    // %Z - time zone offset, such as -0700, -07:00, -07, or Z.
    // %% - a literal percent sign (%).

    var width = 500
    var height = 500
    var target = "hour"
    var fill = "red"
    var fillValues = "orange"
    var fillAxis = "black"
    var valueColumn = undefined
    var valueColumnAggregation = d3.mean
    var xSelector = "x"
    var ySelector = "y"
    var scaleX
    var scaleY
    var scaleY2

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var minMaxData = d3.extent(data, function(d) {
                return d.date
            })

            data.forEach(function(d) {
                d["month"] = d.date.getMonth()
                d["year"] = d.date.getFullYear()
                d["weekday"] = d.date.getDay()
                d["hour"] = d.date.getHours()
                d["minute"] = d.date.getMinutes()
                d["day"] = new Date(d.date).setHours(0, 0, 0, 0)
                d["minute-of-day"] = new Date(d.date).setSeconds(0, 0)
            });
            var minMax = d3.extent(data, function(d) {
                return d[target]
            })

            // console.log(target);
            // console.log(minMax);

            if (target == "month") {
                var xAxisTicks = d3.timeMonths(
                    new Date(2017, 0, 1), new Date(2017, 11, 31))
                var xAxisFormat = d3.timeFormat("%B")
            } else if (target == "year") {
                var xAxisTicks = d3.timeYears(new Date(minMax[0], 0, 1),
                    new Date(minMax[1], 12, 1))
                var xAxisFormat = function(f) {
                    return f
                }
                var sub = []
                xAxisTicks.forEach(function(d) {
                    sub.push(d.getFullYear())
                })
                xAxisTicks = sub
            } else if (target == "weekday") {
                var xAxisTicks = [0, 1, 2, 3, 4, 5, 6]
                var xAxisFormat = d3.timeFormat("%A")
            } else if (target == "day") {
                var xAxisTicks = d3.timeDays(
                    minMaxData[0], minMaxData[1])
                var xAxisFormat = d3.timeFormat("%d.%m.%Y")
            } else if (target == "minute-of-day") {
                var xAxisTicks = d3.timeMinutes(
                    minMaxData[0] - 60 * 1000, minMaxData[1])
                var xAxisFormat = d3.timeFormat("%H:%M")
            }

            scaleX = d3.scaleOrdinal().domain(xAxisTicks).range(
                d3.range(0, width, width / xAxisTicks.length));

            var padding1 = (width / xAxisTicks.length) * 0.1;

            var histogram = d3.histogram().value(function(d) {
                return d[target]
            }).thresholds(xAxisTicks)

            var bins = histogram(data);

            var maxVals = d3.max(bins, function(d) {
                return d.length;
            });


            scaleY = d3.scaleLinear()
                .range([height, 0])
                .domain([0, maxVals + 1]);

            var minMax = d3.extent(bins, function(d) {
                return d.length;
            })

            var barwid = width / xAxisTicks.length - padding1

            s.selectAll("rect")
                .data(bins)
                .enter().append("rect")
                .attr("class", "rects")
                .attr("x", 0)
                .attr("fill", function(d) {
                    return fill
                })
                .attr("transform", function(d) {
                    return "translate(" + scaleX(d.x0) + "," + scaleY(d.length) + ")";
                })
                .attr("width", function(d) {
                    return barwid
                })
                .attr("height", function(d) {
                    return height - scaleY(d.length);
                })

            if (valueColumn) {

                bins.forEach(function(d) {
                    var values = [];
                    d.forEach(function(s) {
                        values = values.concat(s.value);
                    });
                    d.mean = valueColumnAggregation(values)
                });
                var x = d3.scaleOrdinal().domain(xAxisTicks).range(
                    d3.range(0, width, width / xAxisTicks.length));
                var padding2 = (width / xAxisTicks.length) * 0.8;

                var maxVals = d3.max(bins, function(d) {
                    return d.mean;
                });
                scaleY2 = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, maxVals + 1]);

                s.selectAll(".dim")
                    .data(bins)
                    .enter().append("rect")
                    .attr("class", "valuerects")
                    .attr("fill", function(d) {
                        return fillValues
                    })
                    .attr("transform", function(d) {
                        var mid = barwid / 2 - (width / xAxisTicks.length) * 0.1
                        // - padding/2
                        return "translate(" + (x(d.x0) + mid) + "," + scaleY2(d.mean) + ")";
                    })
                    .attr("width", function(d) {
                        return width / xAxisTicks.length - padding2
                    })
                    .attr("height", function(d) {
                        return height - scaleY2(d.mean);
                    })
            }

            // manually generate the discrete x-axis
            var bar = s.append("g")
                .attr("transform", "translate(0," + height + ")")
                .selectAll("xaxis").data(bins).enter()

            bar.append("line")
                .attr("x1", 0).attr("x2", width).style("stroke",
                    fillAxis)

            bar.append("text").text(function(d, i) {
                    if (target != 'weekday') {
                        return xAxisFormat(xAxisTicks[i])
                    } else {
                        // artifical dates 
                        var xForm = d3.timeDays(new Date(2017, 0, 1),
                            new Date(2017, 0, 8))
                        return xAxisFormat(xForm[xAxisTicks[i]])
                        return ""
                    }
                })
                .style("text-anchor", "middle")
                .style("font-size", "70%")
                .style("fill", fillAxis)
                .attr("x", function(d, i) {
                    return i * (width / xAxisTicks.length) + (width / xAxisTicks.length / 2) - (padding1 / 2)
                }).attr("y", function(d) {
                    return this.getBBox().height + 5
                })

            bar.append("line")
                .attr("x1", function(d, i) {
                    return i * (width / xAxisTicks.length) + (width / xAxisTicks.length / 2) - (padding1 / 2)
                }).attr("x2", function(d, i) {
                    return i * (width / xAxisTicks.length) + (width / xAxisTicks.length / 2) - (padding1 / 2)
                }).attr("y1", 0).attr("y2", 5).style("stroke",
                    fillAxis)
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

    chart.target = function(value) {
        if (!arguments.length) return target
        target = value;
        return chart;
    }

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    chart.fillValues = function(value) {
        if (!arguments.length) return fillValues
        fillValues = value;
        return chart;
    }

    chart.fillAxis = function(value) {
        if (!arguments.length) return fillAxis
        fillAxis = value;
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

    chart.scaleY2 = function(value) {
        if (!arguments.length) return scaleY2
        scaleY2 = value;
        return chart;
    }

    chart.valueColumn = function(value) {
        if (!arguments.length) return valueColumn
        valueColumn = value;
        return chart;
    }
    
    chart.valueColumnAggregation = function(value) {
        if (!arguments.length) return valueColumnAggregation
        valueColumnAggregation = value;
        return chart;
    }

    return chart
};
function wbTreeMap() {
    "use strict";

    var width = 500
    var height = 500
    var colors = d3.scaleOrdinal(d3.schemeCategory20c)
    var fill = "black"

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var fader = function(color) {
                return d3.interpolateRgb(color, "#fff")(0.2);
            }
            var format = d3.format(",d");

            var treemap = d3.treemap()
                .tile(d3.treemapResquarify)
                .size([width, height])
                .round(true)
                .paddingInner(1.5);

            var root = d3.hierarchy(data)
                .eachBefore(function(d) {
                    d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
                })
                .sum(function(d) {
                    return d.size;
                })
                .sort(function(a, b) {
                    return b.height - a.height || b.value - a.value;
                });

            treemap(root);

            var cell = s.selectAll("g")
                .data(root.leaves())
                .enter().append("g")
                .attr("class", "cells")

                .attr("transform", function(d) {
                    return "translate(" + d.x0 + "," + d.y0 + ")";
                });

            cell.append("rect")
                .attr("id", function(d) {
                    return d.data.id;
                })
                .attr("width", function(d) {
                    return d.x1 - d.x0;
                })
                .attr("height", function(d) {
                    return d.y1 - d.y0;
                })
                .attr("fill", function(d) {
                    return colors(d.parent.data.id);
                });

            cell.append("clipPath")
                .attr("id", function(d) {
                    return "clip-" + d.data.id;
                })
                .append("use")
                .attr("xlink:href", function(d) {
                    return "#" + d.data.id;
                });

            cell.append("text")
                .style("font-size", "75%")
                .attr("clip-path", function(d) {
                    return "url(#clip-" + d.data.id + ")";
                })
                .selectAll("tspan")
                .data(function(d) {
                    return d.data.name.split(/(?=[A-Z][^A-Z])/g);
                })
                .enter().append("tspan")
                .attr("x", 4)
                .attr("y", function(d, i) {
                    return 13 + i * 10;
                })
                .attr("fill", fill)
                .text(function(d) {
                    return d;
                });



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
};
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
                .font("Abel")
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
};
