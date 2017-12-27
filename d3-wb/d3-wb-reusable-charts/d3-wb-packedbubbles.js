/* exported wbPackedBubbles */
/**
 * Packed bubble visualization.
 * @return {Object} A reusable, updatable chart object.
 */
function wbPackedBubbles() {
    'use strict';

    let width = 500;
    let height = 500;
    let colorRange = ['green', 'white'];
    let fillRange = ['green', 'red'];
    let fadeOpacity;

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            let minMax = d3.extent(data, function(d) {
                return d.value;
            });

            let fgColors = d3.scaleLinear().domain(minMax)
                .interpolate(d3.interpolate)
                .range(colorRange);
            let bgColors = d3.scaleLinear().domain(minMax)
                .interpolate(d3.interpolate)
                .range(fillRange);

            let opScale;
            if (fadeOpacity) {
                opScale = d3.scaleLog().domain(minMax)
                    .range(fadeOpacity);
            }

            let pack = d3.pack()
                .size([width, height])
                .padding(0.3);

            let root = d3.hierarchy({
                    children: data,
                })
                .sum(function(d) {
                    return d.value;
                });

            let bubbleNodes = s.selectAll('node')
                .data(pack(root).leaves())
                .enter().append('g')
                .attr('class', 'node')
                .attr('transform', function(d) {
                    return 'translate(' + d.x + ',' + d.y + ')';
                });

            bubbleNodes
                .append('a').attr('xlink:href', function(d) {
                    return d.data.link;
                })
                .append('circle')
                .attr('class', 'circles')
                .attr('id', function(d) {
                    return d.id;
                })
                .transition().duration(500)
                .attr('r', function(d) {
                    return d.r;
                })
                .style('fill', function(d) {
                    return bgColors(d.value);
                })
                .style('opacity', function(d) {
                    if (fadeOpacity) {
                        return opScale(d.value);
                    }
                    return '1.0';
                });

            bubbleNodes
                .append('a').attr('xlink:href', function(d) {
                    return d.data.link;
                })
                .append('text')
                .attr('class', 'texts')
                .style('font-size', '10px')
                .style('text-anchor', 'middle')
                .style('dominant-baseline', 'middle')
                .attr('x', 0)
                .attr('y', 0)
                .text(function(d) {
                    return d.data.id;
                })
                .style('font-size', function(d, i, nodes) {
                    return ((2 * d.r - 10) /
                    nodes[i].getComputedTextLength() * 10) + 'px';
                })
                .style('opacity', function(d) {
                    if (fadeOpacity) {
                        return opScale(d.value);
                    }
                    return '1.0';
                })
                .transition().duration(1000)
                .style('fill', function(d) {
                    return fgColors(d.value);
                });
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

    chart.colorRange = function(value) {
        if (!arguments.length) return colorRange;
        colorRange = value;
        return chart;
    };

    chart.fillRange = function(value) {
        if (!arguments.length) return fillRange;
        fillRange = value;
        return chart;
    };

    chart.fadeOpacity = function(value) {
        if (!arguments.length) return fadeOpacity;
        fadeOpacity = value;
        return chart;
    };

    return chart;
}
