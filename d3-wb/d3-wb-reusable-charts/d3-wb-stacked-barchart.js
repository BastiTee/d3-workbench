/* exported wbStackedBarChart */
/**
 * Extended bar chart that supports stacked data.
 * @return {Object} A reusable, updatable chart object.
 */
function wbStackedBarChart() {
    'use strict';

    let width = 500;
    let height = 500;
    let xSelector = 'x';
    let ySelector = 'y';
    let idColumn = 'id';
    let colors = ['red', 'green', 'blue'];
    let legendFill = 'black';
    let stroke = 'black';
    let strokeWidth = 0;
    let legendX = 0;
    let legendY = 0;
    let padding = 0.1;
    let align = 0.0;
    let showLegend = true;
    let ignoreColumns = [];
    let scaleX;
    let scaleY;
    let sortBySum = false;

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            // calculate totals
            data.forEach(function(d, i) {
                let keys = Object.keys(d);
                d.total = 0;
                for (i = 0; i < keys.length; ++i) {
                    if (ignoreColumns.includes(keys[i])) {
                        continue;
                    }
                    if (keys[i] == idColumn) {
                        continue;
                    }
                    d.total = d.total + +d[keys[i]];
                }
            });

            // sort data if desired
            if (sortBySum) {
                data.sort(function(a, b) {
                    return b.total - a.total;
                });
            }

            // generate scales
            scaleX = d3.scaleBand().rangeRound([0, width])
                .padding(padding)
                .align(align);
            scaleY = d3.scaleLinear().rangeRound([height, 0]);
            let scaleZ = d3.scaleOrdinal().range(colors);
            scaleX.domain(data.map(function(d) {
                return d.id;
            }));
            scaleY.domain([0, d3.max(data, function(d) {
                return d.total;
            })]).nice();

            let keys = data.columns.filter(function(d) {
                return d != idColumn && !ignoreColumns.includes(d);
            });
            scaleZ.domain(keys);

            let stack = d3.stack().keys(keys)(data);
            // append key to each stack element for later reference
            stack.forEach(function(d) {
                d.forEach(function(e) {
                    e['keyRef'] = d.key;
                });
            });

            // draw chart
            s.append('g')
                .selectAll('g')
                .data(stack)
                .enter().append('g')
                .attr('fill', function(d) {
                    return scaleZ(d.key);
                })
                .selectAll('rect')
                .data(function(d, i) {
                    return d;
                })
                .enter().append('rect')
                .attr('class', 'rects')
                .attr('x', function(d) {
                    return scaleX(d.data.id);
                })
                .attr('y', function(d) {
                    return scaleY(d[1]);
                })
                .attr('height', function(d) {
                    return scaleY(d[0]) - scaleY(d[1]);
                })
                .attr('width', scaleX.bandwidth())
                .style('stroke', stroke)
                .style('stroke-width', strokeWidth);

            if (showLegend) {
                let legend = s.append('g')
                    .attr('font-size', '75%')
                    .attr('text-anchor', 'end')
                    .attr('transform', 'translate(' +
                        legendX + ',' + legendY + ')')
                    .selectAll('g')
                    .data(keys.slice())
                    .enter().append('g')
                    .attr('transform', function(d, i) {
                        return 'translate(0,' + i * 20 + ')';
                    });

                let rw = 19;
                legend.append('rect')
                    .attr('x', -rw)
                    .attr('width', rw)
                    .attr('height', rw)
                    .attr('fill', scaleZ);

                legend.append('text')
                    .attr('x', -rw - 3)
                    .attr('y', 9.5)
                    .attr('dy', '0.32em')
                    .text(function(d) {
                        return d;
                    })
                    .attr('fill', legendFill);
            }
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

    chart.colors = function(value) {
        if (!arguments.length) return colors;
        colors = value;
        return chart;
    };

    chart.legendFill = function(value) {
        if (!arguments.length) return legendFill;
        legendFill = value;
        return chart;
    };

    chart.legendX = function(value) {
        if (!arguments.length) return legendX;
        legendX = value;
        return chart;
    };

    chart.legendY = function(value) {
        if (!arguments.length) return legendY;
        legendY = value;
        return chart;
    };

    chart.sortBySum = function(value) {
        if (!arguments.length) return sortBySum;
        sortBySum = value;
        return chart;
    };

    chart.ignoreColumns = function(value) {
        if (!arguments.length) return ignoreColumns;
        ignoreColumns = value;
        return chart;
    };

    chart.padding = function(value) {
        if (!arguments.length) return padding;
        padding = value;
        return chart;
    };

    chart.align = function(value) {
        if (!arguments.length) return align;
        align = value;
        return chart;
    };

    chart.showLegend = function(value) {
        if (!arguments.length) return showLegend;
        showLegend = value;
        return chart;
    };

    chart.stroke = function(value) {
        if (!arguments.length) return stroke;
        stroke = value;
        return chart;
    };

    chart.strokeWidth = function(value) {
        if (!arguments.length) return strokeWidth;
        strokeWidth = value;
        return chart;
    };

    return chart;
};
