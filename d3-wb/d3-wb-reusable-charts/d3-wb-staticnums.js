/* exported wbStaticNumbers */
/**
 * Not a diagram, but a visualization of a list of
 * numbers and their explanations.
 * @return {Object} A reusable, updatable chart object.
 */
function wbStaticNumbers() {
    'use strict';

    let width = 500;
    let height = 500;
    let fillNumber = 'black';
    let fillLabel = 'red';

    // internal
    let debug = false;
    let REF_FONTSIZE = 20;

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            let cw = width / data.length; // width of column
            let cp = (width * 0.1) / (data.length - 1); // padding betw. column
            let ol = 0.25; // number-label overlap percent

            s.selectAll('number-value')
                .data(data)
                .enter()
                .append('text')
                .text(function(d) {
                    return d.name;
                })
                .attr('x', function(d, i) {
                    return i * cw;
                })
                .attr('y', height)
                .attr('text-anchor', 'left')
                .attr('dominant-baseline', 'baseline')
                .attr('fill', fillNumber)
                .style('font-size', REF_FONTSIZE + 'px')
                .style('font-weight', 'bold')
                .text(function(d) {
                    return d.value;
                })
                .style('font-size', function(d, i, nodes) {
                    return calculateNewFontsize(nodes[i], cw, cp) + 'px';
                })
                .each(function(d, i, nodes) {
                    d.numberBox = nodes[i].getBBox();
                });

            debugNumbers(s, data);

            s.selectAll('number-label')
                .data(data)
                .enter()
                .append('text')
                .text(function(d) {
                    return d.name;
                })
                .attr('x', function(d, i) {
                    return i * cw;
                })
                .attr('y', function(d) {
                    return height - d.numberBox.height
                    + (ol * d.numberBox.height);
                })
                .attr('text-anchor', 'left')
                .attr('fill', fillLabel)
                .style('font-size', REF_FONTSIZE + 'px')
                .text(function(d) {
                    return d.label;
                })
                .style('font-size', function(d, i, nodes) {
                    return calculateNewFontsize(nodes[i], cw, cp) + 'px';
                })
                .each(function(d, i, nodes) {
                    d.numberBox = nodes[i].getBBox();
                });

            debugLabels(s, data);
        });
    };

    let calculateNewFontsize = function(thiss, cw, cp) {
        let textLength = thiss.getComputedTextLength();
        if (debug) {
            console.log('TL=' + textLength);
            console.log(thiss.getBBox().width);
        }
        return (cw - cp) / textLength * REF_FONTSIZE;
    };

    let debugNumbers = function(s, data) {
        if (!debug) return;
        s.selectAll('.debug-rect-numbers')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'debug-rect-numbers')
            .attr('x', function(d) {
                return d.numberBox.x;
            })
            .attr('y', function(d) {
                return d.numberBox.y;
            })
            .attr('height', function(d) {
                return d.numberBox.height;
            })
            .attr('width', function(d) {
                return d.numberBox.width;
            })
            .style('stroke', 'green')
            .style('stroke-width', 1)
            .style('fill', 'none');
    };

    let debugLabels = function(s, data) {
        if (!debug) return;
        s.selectAll('.debug-rect-labels')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'debug-rect-labels')
            .attr('x', function(d) {
                return d.numberBox.x;
            })
            .attr('y', function(d) {
                return d.numberBox.y;
            })
            .attr('height', function(d) {
                return d.numberBox.height;
            })
            .attr('width', function(d) {
                return d.numberBox.width;
            })
            .style('stroke', 'red')
            .style('stroke-width', 1)
            .style('fill', 'none');
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

    chart.fillNumber = function(value) {
        if (!arguments.length) return fillNumber;
        fillNumber = value;
        return chart;
    };

    chart.fillLabel = function(value) {
        if (!arguments.length) return fillLabel;
        fillLabel = value;
        return chart;
    };

    return chart;
}
