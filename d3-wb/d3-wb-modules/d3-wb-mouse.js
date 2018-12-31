/**
 * d3-workbench (d3wb) 'mouse' extension module.
 *
 * A collection of mouse handlers such as tooltips or click-events
 * to allow for mouse-based interactivity.
 *
 * @author BastiTee
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        factory(exports) : typeof define === 'function' &&
        define.amd ? define(['exports'], factory) :
        (factory((global.d3wb.mouse = global.d3wb.mouse || {})));
}(this, (function(exports) {
    'use strict';

    /* *********************************************************************
     * PUBLIC FUNCTIONS
     * ********************************************************************* */

    const tooltip = function() {
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
                        .attr('class', d3wb.prefix('tooltip'))
                        .style('pointer-events', 'none')
                        .style('user-select', 'none')
                        .style('-moz-user-select', 'none');
                    rect = gTooltip.append('rect')
                        .attr('class', d3wb.prefix('tooltip-box'));
                    text = gTooltip.append('text')
                        .attr('class', d3wb.prefix('tooltip-text'));
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
    };

    let click = function() {
        // ------------------------------------
        const defaultEvent = 'dblclick';
        const defaultAction = 'openTarget';
        const supportedEvents = [defaultEvent];
        const supportedActions = [defaultAction];
        // ------------------------------------

        let event = defaultEvent;
        let action = defaultAction;
        let openTarget = function(d, i) {
            return 'https://d3js.org/';
        };

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i]);
                evaluateEventOpen(action, event, s);
            });
        };

        let evaluateEventOpen = function(action, event, s) {
            if (action != 'openTarget') {
                return;
            }
            s.on(event, function(d, i) {
                let trg = openTarget(d, i);
                window.open(trg, '_blank');
            });
        };

        chart.event = function(value) {
            if (!arguments.length) return event;
            if (!supportedEvents.includes(value)) {
                throw new Error('Event \'' + value +
                    '\' not supported! Allowed: ' + supportedEvents);
            }
            event = value;
            return chart;
        };

        chart.action = function(value) {
            if (!arguments.length) return action;
            if (!supportedActions.includes(value)) {
                throw new Error('Action \'' + value +
                    '\' not supported! Allowed: ' + supportedActions);
            }
            action = value;
            return chart;
        };

        chart.openTarget = function(value) {
            if (!arguments.length) return openTarget;
            openTarget = value;
            return chart;
        };

        return chart;
    };


    /* *********************************************************************
     * PUBLIC API
     * ********************************************************************* */

    d3wb.mouse = {
        tooltip: tooltip,
        click: click,
    };
})));
