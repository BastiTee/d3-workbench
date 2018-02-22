/* exported wbBarChartPosNeg */
/**
 * Bar chart with positive and negative values.
 * @return {Object} A reusable, updatable chart object.
 */
let wbBarChartPosNeg = function() {
    'use strict';

    let width = 500;
    let height = 500;
    let padding = 0.1;
    let widthFactor = 1.0;
    let xSelector = 'x';
    let ySelector = 'y';
    let scaleX;
    let scaleY;
    let yExtent;
    let sortDirection = 'desc';
    let fillPos = 'green';
    let fillNeg = 'red';
    let update = function() {};

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            scaleX = d3
                .scaleBand()
                .rangeRound([0, width], .1)
                .padding(padding);

            scaleY = d3.scaleLinear()
                .range([height, 0]);

            update = function(data) {
                data.forEach(function(d) {
                    d[ySelector] = +d[ySelector];
                });

                data.sort(function(a, b) {
                    if (sortDirection == 'desc') {
                        return +b[ySelector] - +a[ySelector];
                    } else {
                        return +a[ySelector] - +b[ySelector];
                    }
                });

                let yExtent = d3.extent(data, function(d) {
                    return d[ySelector];
                });
                scaleY.domain(yExtent);
                let zeroHeight = scaleY(yExtent[0]) - scaleY(0);
                let zeroHeightInv = scaleY(yExtent[0]) - zeroHeight;

                scaleX.domain(data.map(function(d) {
                    return d[xSelector];
                }));

                s.selectAll('.rects')
                    .remove()
                    .exit()
                    .data(data)
                    .enter().append('rect')
                    .attr('class', 'rects')
                    .attr('x', function(d) {
                        return scaleX(d[xSelector]);
                    })
                    .attr('width', function(d) {
                        return scaleX.bandwidth() * widthFactor;
                    })
                    .attr('y', function(d) {
                        if (d[ySelector] >= 0) {
                            return scaleY(d[ySelector]);
                        } else {
                            return zeroHeightInv;
                        }
                    })
                    .attr('height', function(d) {
                        if (d[ySelector] >= 0) {
                            return height - scaleY(d[ySelector]) - zeroHeight;
                        } else {
                            return scaleY(d[ySelector]) - zeroHeightInv;
                        }
                    })
                    .attr('fill', function(d, i) {
                        if (d[ySelector] >= 0) {
                            return fillPos;
                        } else {
                            return fillNeg;
                        }
                    });
            };
            update(data);
        });
    };

    chart.update = function(data) {
        update(data);
        return chart;
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

    chart.xSelector = function(value) {
        if (!arguments.length) return xSelector;
        xSelector = value;
        return chart;
    };

    chart.ySelector = function(value) {
        if (!arguments.length) return ySelector;
        ySelector = value;
        return chart;
    };

    chart.scaleX = function(value) {
        if (!arguments.length) return scaleX;
        scaleX = value;
        return chart;
    };

    chart.scaleY = function(value) {
        if (!arguments.length) return scaleY;
        scaleY = value;
        return chart;
    };

    chart.fillPos = function(value) {
        if (!arguments.length) return fillPos;
        fillPos = value;
        return chart;
    };

    chart.fillNeg = function(value) {
        if (!arguments.length) return fifillNegll;
        fillNeg = value;
        return chart;
    };

    chart.padding = function(value) {
        if (!arguments.length) return padding;
        padding = value;
        return chart;
    };

    chart.widthFactor = function(value) {
        if (!arguments.length) return widthFactor;
        widthFactor = value;
        return chart;
    };

    chart.sortDirection = function(value) {
        if (!arguments.length) return sortDirection;
        if (value != 'desc' && value != 'asc') {
            throw Error('Only desc or asc are allowed as sort order.');
        }
        sortDirection = value;
        return chart;
    };

    return chart;
};
