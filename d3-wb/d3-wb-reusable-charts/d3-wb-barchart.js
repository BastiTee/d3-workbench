/* exported wbBarChart */
/**
 * Basic bar chart.
 * @return {Object} A reusable, updatable chart object.
 */
let wbBarChart = function() {
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
    let sortBy;
    let sortDirection = 'desc';
    let valuesShow;
    let valuesFill = 'black';
    let valuesPadding = 10;
    let valueFormat = function(v) {
        return v;
    };
    let fill = 'blue';
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

                if (sortBy) {
                    data.sort(function(a, b) {
                        if (sortDirection == 'desc') {
                            return +b[sortBy] - +a[sortBy];
                        } else {
                            return +a[sortBy] - +b[sortBy];
                        }
                    });
                }

                let yExtentLocal;
                if (!yExtent) {
                    yExtentLocal = [0, d3.max(data, function(d) {
                        return d[ySelector];
                    })];
                } else {
                    yExtentLocal = yExtent;
                }
                scaleY.domain(yExtentLocal);

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
                        if (widthFactor >= 1) {
                            return scaleX(d[xSelector]);
                        } else {
                            let diff = scaleX.bandwidth() -
                                scaleX.bandwidth() * widthFactor;
                            return scaleX(d[xSelector]) + diff / 2;
                        }
                    })
                    .attr('width', function(d) {
                        return scaleX.bandwidth() * widthFactor;
                    })
                    .attr('y', function(d) {
                        return scaleY(d[ySelector]);
                    })
                    .attr('height', function(d) {
                        return height - scaleY(d[ySelector]);
                    })
                    .attr('fill', function(d, i) {
                        if (typeof fill === 'string') {
                            return fill;
                        } else if (typeof fill === 'function') {
                            return fill(i);
                        } else if (typeof fill === 'object' &&
                            String(fill).startsWith('rgb')) {
                            return fill;
                        } else {
                            return fill[i];
                        }
                    });

                if (!valuesShow) {
                    return;
                }

                s.selectAll('.values')
                    .remove()
                    .exit()
                    .data(data)
                    .enter().append('text')
                    .attr('class', 'values')
                    .attr('fill', valuesFill)
                    .attr('text-anchor', 'middle')
                    .attr('x', function(d) {
                        return scaleX(d[xSelector]) + scaleX.bandwidth() / 2;
                    })
                    .attr('y', function(d) {
                        return scaleY(d[ySelector]) - valuesPadding;
                    })
                    .text(function(d) {
                        return valueFormat(d[ySelector]);
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

    chart.fill = function(value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    chart.yExtent = function(value) {
        if (!arguments.length) return yExtent;
        yExtent = value;
        return chart;
    };

    chart.valuesShow = function(value) {
        if (!arguments.length) return valuesShow;
        valuesShow = value;
        return chart;
    };

    chart.valuesFill = function(value) {
        if (!arguments.length) return valuesFill;
        valuesFill = value;
        return chart;
    };

    chart.valueFormat = function(value) {
        if (!arguments.length) return valueFormat;
        valueFormat = value;
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

    chart.sortBy = function(value) {
        if (!arguments.length) return sortBy;
        sortBy = value;
        return chart;
    };

    return chart;
};
