/* exported wbTextBlock */
/**
 * Not a diagram, but a visualization of a multiline text block.
 * @return {Object} A reusable, updatable chart object.
 */
function wbTextBlock(text) {
    'use strict';

    let width = 500;
    let height = 500;
    let x = 0;
    let y = 0;
    let fill = 'white';
    let lineShift = 0;

    // internal
    let debug = false;
    let REF_FONTSIZE = 20;

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            let dataSplit = text.split('\n')
            data = []
            dataSplit.forEach(function(d) {
                data.push({
                    'text': d.trim()
                })
            })

            let g = s.append('g')
                .attr('class', 'wb-textblock')
                .attr('transform', 'translate(' + x + ',' + y + ')')
            g.selectAll('.wb-textblock-line')
                .data(data)
                .enter()
                .append('text')
                .attr('class', 'wb-textblock-line')
                .text(function(d) {
                    return d.text;
                })
                .attr('text-anchor', 'left')
                .attr('dominant-baseline', 'hanging')
                .attr('fill', fill)
                .style('font-size', REF_FONTSIZE + 'px')
                .text(function(d) {
                    return d.text;
                })
                .style('font-size', function(d, i, nodes) {
                    return calculateNewFontsize(nodes[i], width) + 'px';
                })
                .each(function(d, i, nodes) {
                    d.numberBox = nodes[i].getBBox();
                })


            g.selectAll('.wb-textblock-line')
                .each(function(d, i, nodes) {
                    if (i == 0) {
                        return
                    }
                    d3.select(nodes[i])
                        .attr('y', function(d) {
                            let y = 0;
                            for (let j = i - 1; j >= 0; j--) {
                                y = y + nodes[j].getBBox().height
                            }
                            return y + lineShift*i;
                        })
                    d.numberBox = nodes[i].getBBox();
                })

            debugNumbers(s, data);
        });
    };

    let calculateNewFontsize = function(thiss, width) {
        let textLength = thiss.getComputedTextLength();
        if (debug) {
            console.log('TL=' + textLength);
            console.log(thiss.getBBox().width);
        }
        return width / textLength * REF_FONTSIZE;
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

    chart.fill = function(value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    chart.x = function(value) {
        if (!arguments.length) return x
        x = value;
        return chart;
    }

    chart.y = function(value) {
        if (!arguments.length) return y
        y = value;
        return chart;
    }

    chart.lineShift = function(value) {
        if (!arguments.length) return lineShift
        lineShift = value;
        return chart;
    }

    return chart;
}
