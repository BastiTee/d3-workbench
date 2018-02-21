/* exported wbPosNeg */
/**
 * A positive-negative comparison chart.
 * @return {Object} A reusable, updatable chart object.
 */
let wbPosNeg = function() {
    'use strict';

    let width = 500;
    let height = 500;
    let padding = 0.1;
    let scaleX;
    let scaleY;
    let fillPos = 'green';
    let fillNeg = 'red';

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            data.forEach(function(d) {
                d['pos'] = +d['pos']
                d['neg'] = +d['neg']
                d['sum'] = +d['sum']
            })
            // reverse to make rect-generator code easier to read
            data = data.reverse()

            let xMinMax = d3.extent(data, function(d) {
                return Math.max(d['pos'], -d['neg'])
            })
            xMinMax[0] = 0

            scaleX = d3.scaleLinear()
                .range([0, width / 2])
                .domain(xMinMax);

            scaleY = d3
                .scaleBand()
                .rangeRound([height, 0], .1)
                .padding(0.2)
                .domain(data.map(function(d) {
                    return d['label'];
                }));

            s.selectAll('.rects-pos')
                .remove()
                .exit()
                .data(data)
                .enter().append('rect')
                .attr('class', 'rects-pos')
                .attr('x', width / 2)
                .attr('width', function(d) {
                    return scaleX(d['pos'])
                })
                .attr('y', function(d) {
                    return scaleY(d['label']);
                })
                .attr('height', function(d) {
                    return scaleY.bandwidth()
                })
                .style('fill', fillPos)

            s.selectAll('.rects-neg')
                .remove()
                .exit()
                .data(data)
                .enter().append('rect')
                .attr('class', 'rects-neg')
                .attr('x', function(d) {
                    return (width / 2) - scaleX(-d['neg'])
                })
                .attr('width', function(d) {
                    return scaleX(-d['neg'])
                })
                .attr('y', function(d) {
                    return scaleY(d['label']);
                })
                .attr('height', function(d) {
                    return scaleY.bandwidth()
                })
                .style('fill', fillNeg)

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
        if (!arguments.length) return fillNeg;
        fillNeg = value;
        return chart;
    };

    chart.padding = function(value) {
        if (!arguments.length) return padding;
        padding = value;
        return chart;
    };

    return chart;
};
