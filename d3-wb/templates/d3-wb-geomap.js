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
    var update = function() {}

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

            update = function(first) {
                first = first || false
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

    chart.update = function() {
        update()
        return chart
    }

    return chart
}