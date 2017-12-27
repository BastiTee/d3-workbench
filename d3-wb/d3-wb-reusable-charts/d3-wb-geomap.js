/* exported wbGeoMap */
/**
 * Basic geo map projection inspired by
 * http://bl.ocks.org/oscar6echo/4423770
 * @return {Object} A reusable, updatable chart object.
 */
function wbGeoMap() {
    'use strict';

    let width = 500;
    let height = 500;
    let mapFill = '#666666';
    let mapStroke = '#555555';
    let mapStrokeWidth = 1;
    let boundsManual;
    let projection;
    let allowZoom = true;
    let update = function() {};

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);
        let focused;
        let geoPath;

            let applyZoom = function(d) {
                let x = width / 2;
                let y = height / 2;
                let k = 1;

                if ((focused === null) || !(focused === d)) {
                    let centroid = geoPath.centroid(d);
                    x = +centroid[0],
                    y = +centroid[1],
                    k = 2.5;
                    focused = d;
                } else {
                    focused = null;
                };

                s.transition()
                    .duration(1000)
                    .attr('transform',
                    'translate(' + (width / 2) + ',' +
                    (height / 2) + ')scale(' + k +
                    ')translate(' + (-x) + ',' +
                        (-y) + ')')
                    .style('stroke-width', 1.75 / k + 'px');
            };

/*             let resetZoom = function() {
                focused = null;
                s.transition()
                    .duration(500)
                    .attr('transform',
                        'scale(' + 1 + ')translate(' + 0 + ',' + 0 + ')')
                    .style('stroke-width', 1.00 + 'px');
            }; */

            let bounds = d3.geoBounds(data);
            if (boundsManual) {
                bounds = boundsManual;
                // console.log("-- manually set bounds to " + bounds);
            } else {
                // console.log("-- bounds read to " + bounds);
            }
            let bottomLeft = bounds[0];
            let topRight = bounds[1];
            let rotLong = -(topRight[0] + bottomLeft[0]) / 2;
            let center = [(topRight[0] + bottomLeft[0]) / 2 +
                rotLong, (topRight[1] + bottomLeft[1]) / 2,
            ];

            projection = d3.geoAlbers()
                .parallels([bottomLeft[1], topRight[1]])
                .translate([width / 2, height / 2])
                .rotate([rotLong, 0, 0])
                .center(center);

            let bottomLeftPx = projection(bottomLeft);
            let topRightPx = projection(topRight);
            let scaleFactor = 1.00 * Math.min(width / (topRightPx[0] -
                bottomLeftPx[0]), height / (-topRightPx[1] + bottomLeftPx[1]));
            projection = d3.geoAlbers()
                .parallels([bottomLeft[1], topRight[1]])
                .rotate([rotLong, 0, 0])
                .translate([width / 2, height / 2])
                .scale(scaleFactor * 0.975 * 1000)
                .center(center);

            geoPath = d3.geoPath().projection(projection);

            update = function() {
                s.selectAll('.wb-feature-paths')
                    .exit()
                    .remove()
                    .data(data.features)
                    .enter()
                    .append('path')
                    .attr('d', geoPath)
                    .attr('class', 'wb-feature-paths')
                    .style('fill', mapFill)
                    .style('stroke', mapStroke)
                    .style('stroke-width', mapStrokeWidth);
                if (allowZoom) {
                    s.selectAll('.wb-feature-paths')
                        .on('click', applyZoom);
                }
            };
            update();
        });
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.projection = function(value) {
        if (!arguments.length) return projection;
        projection = value;
        return chart;
    };

    chart.mapFill = function(value) {
        if (!arguments.length) return mapFill;
        mapFill = value;
        return chart;
    };

    chart.mapStroke = function(value) {
        if (!arguments.length) return mapStroke;
        mapStroke = value;
        return chart;
    };

    chart.boundsManual = function(value) {
        if (!arguments.length) return boundsManual;
        boundsManual = value;
        return chart;
    };

    chart.mapStrokeWidth = function(value) {
        if (!arguments.length) return mapStrokeWidth;
        mapStrokeWidth = value;
        return chart;
    };

    chart.allowZoom = function(value) {
        if (!arguments.length) return allowZoom;
        allowZoom = value;
        return chart;
    };

    chart.update = function() {
        update();
    };

    return chart;
};
