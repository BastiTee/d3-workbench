/**
 * d3-workbench (d3wb) 'add' extension module.
 *
 * A collection of functions to create recurring figure elements such as
 * x/y-axis, titles etc. with minimal boilerplate code.
 *
 * @author BastiTee
 */
(function(global, factory) {
    if (global.d3wb.util === undefined) {
        throw new Error('d3wb.util required but not loaded.');
    }
    typeof exports === 'object' && typeof module !== 'undefined' ?
        factory(exports) : typeof define === 'function' &&
        define.amd ? define(['exports'], factory) :
        (factory((global.d3wb.add = global.d3wb.add || {})));
}(this, (function(exports) {
    'use strict';

    /* *********************************************************************
     * PUBLIC FUNCTIONS
     * ********************************************************************* */

    let xAxis = function(scale) {
        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i]);
                let axis = s.append('g')
                    .attr('transform', 'translate(' + c.x + ',' +
                        c.y + ')')
                    .attr('class', d3wb.prefix('axis axis-x'))
                    .call(d3wb.util.makeUnselectable());
                c.update = function(first) {
                    first = first || false;
                    let scale = applyScaleSettings(c);
                    if (first) {
                        axis.call(scale);
                    } else {
                        axis.transition().duration(500).call(scale);
                    }
                };
                c.update(true);
                injectAxisColor(c.color, axis);
                if (rotation == 90) {
                    axis.selectAll('text')
                        .attr('y', -2)
                        .attr('x', -9)
                        .attr('dy', '.35em')
                        .style('text-anchor', 'end')
                        .attr('transform', 'rotate(-90)');
                }
            });
        };

        let rotation = undefined;
        chart.rotation = function(value) {
            if (!arguments.length) return rotation;
            rotation = value;
            return chart;
        };

        let c = commonAxisElements(chart, d3.axisTop, scale);
        return chart;
    };

    let xAxisBottom = function(scale) {
        return xAxis(scale).type(d3.axisBottom);
    };

    let yAxis = function(scale) {
        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i]);
                let axis = s.append('g')
                    .attr('class', d3wb.prefix('axis axis-y'))
                    .attr('transform', 'translate(' + c.x + ',' + c.y + ')')
                    .call(d3wb.util.makeUnselectable());
                c.update = function(first) {
                    first = first || false;
                    let scale = applyScaleSettings(c);
                    if (first) {
                        axis.call(scale);
                    } else {
                        axis.transition().duration(500).call(scale);
                    }
                };
                c.update(true);
                injectAxisColor(c.color, axis);
            });
        };

        let c = commonAxisElements(chart, d3.axisLeft, scale);
        return chart;
    };

    let yAxisRight = function(scale) {
        return yAxis(scale).type(d3.axisRight);
    };

    let title = function(text) {
        if (text === undefined || text == '') {
            throw Error('Call to d3wb.add.title requires a text' +
                ' string as function argument.');
        }
        let color = 'black';
        let fontSize = '140%';

        let update = function() {};

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i].ownerSVGElement);
                let root = s.node().getBBox();
                s.append('text')
                    .attr('class', d3wb.prefix('title'))
                    .attr('x', root.width / 2)
                    .attr('y', 5)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'hanging')
                    .call(d3wb.util.makeUnselectable()).style('fill', color)
                    .style('font-size', fontSize);

                update = function() {
                    s.selectAll(d3wb.selector('title')).text(text);
                };
                update();
            });
        };

        chart.color = function(value) {
            if (!arguments.length) return color;
            color = value;
            return chart;
        };

        chart.fontSize = function(value) {
            if (!arguments.length) return fontSize;
            fontSize = value;
            return chart;
        };

        chart.text = function(value) {
            if (!arguments.length) return text;
            text = value;
            return chart;
        };

        chart.update = function() {
            update();
        };

        return chart;
    };

    let xAxisLabel = function(text) {
        if (text === undefined || text == '') {
            throw Error('Call to d3wb.add.xAxisLabel requires a label' +
                ' string as function argument.');
        }

        let color = 'black';
        let padding = 15;
        let orientation = 'top';

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i].ownerSVGElement);
                let root = s.node().getBBox();
                s.append('text') // text label for the x axis
                    .attr('class', d3wb.prefix('label label-x'))
                    .attr('transform', function() {
                        let t = 'translate(' + (root.width / 2) + ',';
                        if (orientation == 'top') {
                            t += padding;
                        } else {
                            t += root.height - padding;
                        };
                        t += ')';
                        return t;
                    })
                    .style('text-anchor', 'middle')
                    .style('fill', color)
                    .call(d3wb.util.makeUnselectable())
                    .attr('dominant-baseline', function() {
                        if (orientation == 'top') {
                            return 'hanging';
                        } else {
                            return 'auto';
                        };
                    })
                    .text(text);
            });
        };

        chart.color = function(value) {
            if (!arguments.length) return color;
            color = value;
            return chart;
        };

        chart.orientation = function(value) {
            if (!arguments.length) return orientation;
            if (value != 'top' && value != 'bottom') {
                throw Error('Invalid orientation for d3wb.add.xAxisLabel. ' +
                    'Allowed values: top, bottom');
            }
            orientation = value;
            return chart;
        };
        return chart;
    };

    let yAxisLabel = function(text) {
        if (text === undefined || text == '') {
            throw Error('Call to d3wb.add.yAxisLabel requires a label' +
                ' string as function argument.');
        }

        let color = 'black';
        let padding = 5;
        let orientation = 'left';

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i].ownerSVGElement);
                let root = s.node().getBBox();
                s.append('text') // text label for the x axis
                    .attr('class', d3wb.prefix('label label-y'))
                    .attr('transform', function() {
                        let t = 'translate(';
                        if (orientation == 'left') {
                            t += padding;
                        } else {
                            t += root.width - padding;
                        };
                        t += ',' + root.height / 2 + ') rotate(';
                        if (orientation == 'left') {
                            t += '-90';
                        } else {
                            t += '90';
                        };
                        t += ')';
                        return t;
                    })
                    .style('text-anchor', 'middle')
                    .attr('dominant-baseline', 'hanging')
                    .style('fill', color)
                    .call(d3wb.util.makeUnselectable())
                    .text(text);
            });
        };

        chart.color = function(value) {
            if (!arguments.length) return color;
            color = value;
            return chart;
        };

        chart.orientation = function(value) {
            if (!arguments.length) return orientation;
            if (value != 'left' && value != 'right') {
                throw Error('Invalid orientation for d3wb.add.yAxisLabel. ' +
                    'Allowed values: left, right');
            }
            orientation = value;
            return chart;
        };
        return chart;
    };

    let legend = function() {
        let color = 'black';
        let stroke;
        let colors = ['darkblue', 'blue', 'steelblue'];
        let text = ['Item 1', 'Item 2', 'Item 3'];
        let x = 0;
        let y = 0;
        let symbol = d3.symbolTriangle;
        let symbolSize = 100;

        let chart = function(selection) {
            selection.each(function(d, i, nodes) {
                let s = d3.select(nodes[i]);
                s.append('g')
                    .attr('class', d3wb.prefix('legend'))
                    .attr('transform', 'translate(' + x + ',' + y + ')');
                let ordinal = d3.scaleOrdinal()
                    .domain(text.map(function(d) {
                        return d;
                    }))
                    .range(text.map(function(d, i) {
                        return colors[i];
                    }));
                let legend = d3.legendColor()
                    .shape('path',
                        d3.symbol().type(symbol).size(symbolSize)())
                    .scale(ordinal);
                s.select(d3wb.selector('legend'))
                    .call(legend)
                    .style('fill', color)
                    .style('font-size', '90%');
                if (stroke) {
                    s.selectAll('path.swatch').style('stroke', stroke);
                }
                // re-class legend components
                s.selectAll('.cell')
                    .attr('class', d3wb.prefix('cell'));
                s.selectAll('.legendCells')
                    .attr('class', d3wb.prefix('legend-cells'));
                s.selectAll('.label')
                    .attr('class', d3wb.prefix('cell-label'))
                    .call(d3wb.util.makeUnselectable());
                s.selectAll('.swatch')
                    .attr('class', d3wb.prefix('cell-symbol'));
            });
        };

        chart.stroke = function(value) {
            if (!arguments.length) return stroke;
            stroke = value;
            return chart;
        };

        chart.x = function(value) {
            if (!arguments.length) return x;
            x = value;
            return chart;
        };

        chart.y = function(value) {
            if (!arguments.length) return y;
            y = value;
            return chart;
        };

        chart.text = function(value) {
            if (!arguments.length) return text;
            text = value;
            return chart;
        };

        chart.colors = function(value) {
            if (!arguments.length) return colors;
            colors = value;
            return chart;
        };

        chart.color = function(value) {
            if (!arguments.length) return color;
            color = value;
            return chart;
        };

        chart.symbol = function(value) {
            if (!arguments.length) return symbol;
            symbol = value;
            return chart;
        };

        chart.symbolSize = function(value) {
            if (!arguments.length) return symbolSize;
            symbolSize = value;
            return chart;
        };

        return chart;
    };

    let textBox = function(text) {
        if (text === undefined || text == '') {
            throw Error('Call to d3wb.add.textBox requires a text' +
                ' string as function argument.');
        }
        let x = 0;
        let y = 0;
        let width = 100;
        let height = 100;
        let fill = 'white';
        let backgroundColor = 'steelblue';
        let padding = 3;
        let borderRadius = 5;
        let adjustBackgroundHeight = true;

        let debug = false;

        // internal
        let REF_FONTSIZE = 20;

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i]);

                data = []; // convert to objects
                // remove multiple linebreaks
                text = text.replace(/\n+/, '\n');
                text.split('\n').forEach(function(d) {
                    data.push({
                        'text': d.trim(),
                    });
                });

                // base group for text box
                let g = s.append('g')
                    .attr('class', d3wb.prefix('textbox'))
                    .attr('transform', 'translate(' +
                        (x + padding) + ',' + (y + padding) + ')');

                // background color
                let bg = g.append('rect')
                    .attr('class', d3wb.prefix('textbox-bg'))
                    .attr('x', -padding)
                    .attr('y', -padding)
                    .attr('width', width + padding * 2)
                    .attr('height', height + padding * 2)
                    .attr('rx', borderRadius)
                    .attr('ry', borderRadius)
                    .attr('fill', backgroundColor);

                // draw and autoscale text
                let totalHeight = 0;
                g.selectAll(d3wb.selector('textbox-line'))
                    .data(data)
                    .enter()
                    .append('text')
                    .attr('class', d3wb.prefix('textbox-line'))
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
                        totalHeight += d.numberBox.height;
                    })
                    .call(d3wb.util.makeUnselectable());

                let totalShift = data.legend == 1 ? 0 :
                    (height - totalHeight) / (data.length - 1);
                totalShift = totalShift > 0 ? 0 : totalShift;

                // relocate lines according to bounding box
                g.selectAll(d3wb.selector('textbox-line'))
                    .each(function(d, i, nodes) {
                        // center line inside box
                        d3.select(nodes[i])
                            .attr('x', function(d) {
                                // centering
                                let corr = width - nodes[i].getBBox().width;
                                return Math.floor(corr / 2);
                            });
                        d3.select(nodes[i])
                            .attr('y', function(d) {
                                let y = 0;
                                if (i == 0) {
                                    return y;
                                }
                                // line over line
                                for (let j = i - 1; j >= 0; j--) {
                                    y = y + nodes[j].getBBox().height +
                                        totalShift;
                                }
                                return y;
                            });
                        d.numberBox = nodes[i].getBBox();
                    });

                if (adjustBackgroundHeight) {
                    bg.attr('height', totalHeight +
                        padding * 2 + totalShift * (data.length - 1));
                }

                drawDebugFrames(s, data, g);
            });
        };

        let calculateNewFontsize = function(thiss, width) {
            let textLength = thiss.getComputedTextLength();
            return width / textLength * REF_FONTSIZE;
        };

        let drawDebugFrames = function(s, data, g) {
            if (!debug) return;

            d3.selectAll(d3wb.selector('textbox-debug')).remove();
            g.append('g').attr('class', d3wb.prefix('textbox-debug'))
                .selectAll(d3wb.selector('textbox-line-debug'))
                .data(data)
                .enter()
                .append('rect')
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
                .style('stroke', 'yellow')
                .style('stroke-width', 1)
                .style('fill', 'none');

            g.append('circle')
                .attr('r', 4)
                .style('fill', 'yellow');
        };

        chart.x = function(value) {
            if (!arguments.length) return x;
            x = value;
            return chart;
        };

        chart.y = function(value) {
            if (!arguments.length) return y;
            y = value;
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

        chart.fill = function(value) {
            if (!arguments.length) return fill;
            fill = value;
            return chart;
        };

        chart.backgroundColor = function(value) {
            if (!arguments.length) return backgroundColor;
            backgroundColor = value;
            return chart;
        };

        chart.padding = function(value) {
            if (!arguments.length) return padding;
            padding = value;
            return chart;
        };

        chart.borderRadius = function(value) {
            if (!arguments.length) return borderRadius;
            borderRadius = value;
            return chart;
        };

        chart.adjustBackgroundHeight = function(value) {
            if (!arguments.length) return adjustBackgroundHeight;
            adjustBackgroundHeight = value;
            return chart;
        };

        return chart;
    };

    let shadow = function() {
        let blur = 3;
        let xOffset = 2;
        let yOffset = 1;
        let opacity = 0.4;
        let id = d3wb.util.websafeShortGuid() + '-shadow';

        let chart = function(selection) {
            selection.each(function(d, i, nodes) {
                let s = d3.select(nodes[i]);
                let svg = d3.select(nodes[i].ownerSVGElement);
                let defs = svg.append('defs');
                let filter = defs.append('filter')
                    .attr('id', id);
                filter.append('feGaussianBlur')
                    .attr('in', 'SourceAlpha')
                    .attr('stdDeviation', blur)
                    .attr('result', 'blur');
                filter.append('feOffset')
                    .attr('in', 'blur')
                    .attr('dx', xOffset)
                    .attr('dy', yOffset)
                    .attr('result', 'offsetBlur');
                filter.append('feComponentTransfer')
                    .append('feFuncA')
                    .attr('type', 'linear')
                    .attr('slope', opacity);
                let feMerge = filter.append('feMerge');
                feMerge.append('feMergeNode')
                    .attr('in", "offsetBlur');
                feMerge.append('feMergeNode')
                    .attr('in', 'SourceGraphic');

                s.style('filter', 'url(#' + id + ')');
            });
        };
        return chart;
    };

    /* *********************************************************************
     * PRIVATE FUNCTIONS
     * ********************************************************************* */

    let injectAxisColor = function(color, axis) {
        axis.selectAll('line')
            .style('stroke', color);
        axis.selectAll('path')
            .style('stroke', color);
        axis.selectAll('text')
            .attr('fill', color);
    };

    let applyScaleSettings = function(c) {
        let currentScale = c.type(c.scale);
        if (c.ticks) {
            currentScale.ticks(c.ticks);
        }
        if (c.tickFormat) {
            currentScale.tickFormat(c.tickFormat);
        }
        return currentScale;
    };

    let commonAxisElements = function(chart, defaultType, defaultScale) {
        if (defaultScale === undefined) {
            throw Error('Call to d3wb.add.axis requires a d3.scale as' +
                ' function argument.');
        }

        let c = {};
        c.x = 0;
        chart.x = function(value) {
            if (!arguments.length) return x;
            c.x = value;
            return chart;
        };

        c.y = 0;
        chart.y = function(value) {
            if (!arguments.length) return y;
            c.y = value;
            return chart;
        };

        c.type = defaultType;
        chart.type = function(value) {
            if (!arguments.length) return type;
            c.type = value;
            return chart;
        };

        c.scale = defaultScale;
        chart.scale = function(value) {
            if (!arguments.length) return type;
            c.scale = value;
            return chart;
        };

        c.ticks;
        chart.ticks = function(value) {
            if (!arguments.length) return ticks;
            c.ticks = value;
            return chart;
        };

        c.tickFormat;
        chart.tickFormat = function(value) {
            if (!arguments.length) return tickFormat;
            c.tickFormat = value;
            return chart;
        };

        c.color = 'black';
        chart.color = function(value) {
            if (!arguments.length) return color;
            c.color = value;
            return chart;
        };

        c.update = function() {};
        chart.update = function(scale) {
            c.update(scale);
        };

        chart.truncate = function(value) {
            chart.tickFormat(function(d) {
                if (d.length > value) {
                    return d.substring(0, value) + '…';
                } else {
                    return d;
                }
            });
            return chart;
        };

        return c;
    };

    /* *********************************************************************
     * PUBLIC API
     * ********************************************************************* */

    d3wb.add = {
        xAxis: xAxis,
        xAxisTop: xAxis,
        xAxisBottom: xAxisBottom,
        xAxisLabel: xAxisLabel,
        yAxis: yAxis,
        yAxisLeft: yAxis,
        yAxisRight: yAxisRight,
        yAxisLabel: yAxisLabel,
        title: title,
        textBox: textBox,
        legend: legend,
        shadow: shadow,
    };
})));
