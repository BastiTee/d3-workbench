/* exported wbCooltip */
/**
 * Cool tooltips for SVG elements with self-defined
 * data selector.
 * @return {Object} A reusable, updatable tool-tip object.
 */
function wbCooltip() {
    'use strict';

    let opacity = 0.8;
    let padding = 5;
    let color = 'white';
    let fill = 'black';
    let lineHeight = 20;
    let roundCorners = 5;
    let selector = function() {
        return new Date().toDateString() + '\n' +
            String(Math.floor(Math.random() * 9e8));
    };

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);
            let root = nodes[i].ownerSVGElement;
            let dim = root.getBBox();
            let active = false;
            let gTooltip;
            let rect;
            let text;

            let mousemove = function() {
                let pos = d3.mouse(root);
                let txtBox = rect.node().getBBox();
                let newx = pos[0];
                let newy = pos[1] - txtBox.height;
                // STOP ON BORDERS
                // left side
                newx = newx - (txtBox.width / 2) < 0 ?
                    txtBox.width / 2 : newx;
                // right side
                newx = newx + (txtBox.width / 2) > dim.width ?
                    dim.width - (txtBox.width / 2) : newx;
                // top side
                newy = newy - padding < 0 ? padding : newy;
                // bottom side
                newy = newy + txtBox.height - padding > dim.height ?
                    dim.height - txtBox.height + padding : newy;
                // move
                gTooltip.attr('transform', 'translate(' +
                    newx + ',' + newy + ')');
            };

            let mouseout = function() {
                if (!active) {
                    return;
                }
                active = false;
                gTooltip.remove();
            };

            let mouseover = function(d) {
                if (active) {
                    return;
                }
                active = true;
                gTooltip = d3.select(root).append('g')
                    .style('pointer-events', 'none');
                rect = gTooltip.append('rect');
                text = gTooltip.append('text');
                // append tooltip text
                let string = '' + selector(d);
                let split = string.split('\n');
                for (let i in split) {
                    if (!Object.prototype.hasOwnProperty.call(split, i)) {
                        continue;
                    }
                    text.append('tspan')
                        .style('text-anchor', 'middle')
                        .style('dominant-baseline', 'hanging')
                        .style('fill', color)
                        .attr('x', 0)
                        .attr('dy', function() {
                            return i == 0 ? 0 : lineHeight;
                        })
                        .text(split[i]);
                }
                // append background rectangle depending on text size
                let txtBox = text.node().getBBox();
                rect
                    .attr('rx', roundCorners).attr('ry', roundCorners)
                    .attr('width', txtBox.width + padding * 2)
                    .attr('height', txtBox.height + padding * 2)
                    .attr('x', -(txtBox.width / 2) - padding)
                    .attr('y', -padding)
                    .attr('opacity', opacity)
                    .style('fill', fill);
            };

            s.on('mouseover', mouseover);
            s.on('mouseout', mouseout);
            s.on('mousemove', mousemove);
        });
    };

    chart.opacity = function(value) {
        if (!arguments.length) return opacity;
        opacity = value;
        return chart;
    };

    chart.padding = function(value) {
        if (!arguments.length) return padding;
        padding = value;
        return chart;
    };

    chart.color = function(value) {
        if (!arguments.length) return color;
        color = value;
        return chart;
    };

    chart.fill = function(value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    chart.lineHeight = function(value) {
        if (!arguments.length) return lineHeight;
        lineHeight = value;
        return chart;
    };

    chart.roundCorners = function(value) {
        if (!arguments.length) return roundCorners;
        roundCorners = value;
        return chart;
    };

    chart.selector = function(value) {
        if (!arguments.length) return selector;
        selector = value;
        return chart;
    };

    return chart;
}
