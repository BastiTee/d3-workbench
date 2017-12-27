/* exported wbHeatMap */
/**
 * Basic heat map.
 * @return {Object} A reusable, updatable chart object.
 */
function wbHeatMap() {
    'use strict';

    let width = 500;
    let height = 500;
    let fill = 'black';
    let colors = ['#ffffd9', '#edf8b1', '#c7e9b4', '#7fcdbb',
        '#41b6c4', '#1d91c0', '#225ea8', '#253494', '#081d58',
    ];

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            data.forEach(function(d) {
                d.day = +d.day;
                d.hour = +d.hour;
                d.value = +d.value;
            });

            let numHours = 24;
            let times = Array(numHours);
            for (let i = 0; i < times.length; i++) {
                times[i] = i + '';
            }
            let days = ['Monday', 'Tuesday',
            'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            let gridSizeX = Math.floor(width / numHours);
            let gridSizeY = Math.floor(height / days.length);

            s.selectAll('.dayLabel')
                .data(days)
                .enter().append('text')
                .text(function(d) {
                    return d;
                })
                .attr('x', 0)
                .attr('y', function(d, i) {
                    return i * gridSizeY;
                })
                .style('text-anchor', 'end')
                .style('fill', fill)
                .attr('dominant-baseline', 'middle')
                .attr('transform', 'translate(-6,' + gridSizeY / 2 + ')');

            s.selectAll('.timeLabel')
                .data(times)
                .enter().append('text')
                .text(function(d) {
                    return d;
                })
                .attr('x', function(d, i) {
                    return i * gridSizeX;
                })
                .attr('y', 0)
                .style('text-anchor', 'middle')
                .style('fill', fill)
                .attr('transform', 'translate(' + gridSizeX / 2 + ', -6)');

            let heatMap = s.selectAll('.hour')
                .data(data)
                .enter().append('rect')
                .attr('x', function(d) {
                    return (d.hour) * gridSizeX;
                })
                .attr('y', function(d) {
                    return (d.day - 1) * gridSizeY;
                })
                .attr('class', 'hour bordered')
                .attr('width', gridSizeX)
                .attr('height', gridSizeY)
                .attr('stroke', fill)
                .attr('stroke-width', '1')
                .style('fill', fill);

            let minMax = d3.extent(data, function(d) {
                return d.value;
            });
            let colorScale = d3.scaleQuantile()
                .domain(minMax)
                .range(colors);

            heatMap.style('fill', function(d) {
                return colorScale(d.value);
            });

            let legend = s.selectAll('.legend')
                .data([0].concat(colorScale.quantiles()), function(d) {
                    return d;
                })
                .enter().append('g');

            legend.append('rect')
                .attr('x', function(d, i) {
                    return gridSizeX * 2 * i;
                })
                .attr('y', height + 10)
                .attr('width', gridSizeX * 2)
                .attr('height', gridSizeY / 2)
                .attr('stroke', fill)
                .attr('stroke-width', '1')
                .style('fill', function(d, i) {
                    return colors[i];
                });

            legend.append('text')
                .attr('dominant-baseline', 'hanging')
                .text(function(d) {
                    return '≥ ' + Math.round(d);
                })
                .attr('x', function(d, i) {
                    return gridSizeX * 2 * i;
                })
                .attr('y', height + gridSizeY)
                .style('fill', fill);
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

    chart.colors = function(value) {
        if (!arguments.length) return colors;
        colors = value;
        return chart;
    };

    chart.fill = function(value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    return chart;
};
