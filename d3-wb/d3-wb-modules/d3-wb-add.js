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
                let d3a = c.type(scale);
                appendTickStyle(d3a, c);
                let axis = s.append('g')
                    .attr('transform', 'translate(' + c.x + ',' +
                        c.y + ')')
                    .attr('class', 'wb-axis wb-axis-x')
                    .call(d3wb.util.makeUnselectable());
                injectAxisColor(c.color, 'wb-axis-x');
                c.update = function() {
                    axis.call(d3a);
                };
                c.update();
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

        let c = commonAxisElements(chart, d3.axisTop);
        return chart;
    };

    let xAxisBottom = function(scale) {
        return xAxis(scale).type(d3.axisBottom);
    };

    let yAxis = function(scale) {
        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i]);
                let d3a = c.type(scale);
                appendTickStyle(d3a, c);
                injectAxisColor(c.color, 'wb-axis-y');
                let axis = s.append('g')
                    .attr('class', 'wb-axis wb-axis-y')
                    .attr('transform', 'translate(' + c.x + ',' + c.y + ')')
                    .call(d3wb.util.makeUnselectable());
                c.update = function() {
                    axis.call(d3a);
                };
                c.update();
            });
        };

        let c = commonAxisElements(chart, d3.axisLeft);
        return chart;
    };

    let yAxisRight = function(scale) {
        return yAxis(scale).type(d3.axisRight);
    };

    let title = function(text) {
        let color = 'red';
        let fontSize = '140%';

        let update = function() {};

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i].ownerSVGElement);
                let root = s.node().getBBox();
                s.append('text')
                    .attr('class', 'wb-title')
                    .attr('x', root.width / 2)
                    .attr('y', 5)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'hanging')
                    .call(d3wb.util.makeUnselectable()).style('fill', color)
                    .style('font-size', fontSize);

                update = function() {
                    s.selectAll('.wb-title').text(text);
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
        let color = 'red';
        let padding = 15;
        let orientation = 'top';

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i].ownerSVGElement);
                let root = s.node().getBBox();
                s.append('text') // text label for the x axis
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
            orientation = value;
            return chart;
        };
        return chart;
    };

    let yAxisLabel = function(text) {
        let color = 'red';
        let padding = 5;
        let orientation = 'left';

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i].ownerSVGElement);
                let root = s.node().getBBox();
                s.append('text') // text label for the x axis
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
            orientation = value;
            return chart;
        };
        return chart;
    };

    let shadow = function() {
        let blur = 3;
        let xOffset = 2;
        let yOffset = 1;
        let opacity = 0.4;
        let id = d3wb.util.guid();

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

    let legend = function() {
        let color = 'white';
        let stroke;
        let colors = ['red', 'green', 'blue'];
        let text = ['Item 1', 'Item 2', 'Item 3'];
        let x = 0;
        let y = 0;
        let symbol = d3.symbolCircle;
        let symbolSize = 100;

        let chart = function(selection) {
            selection.each(function(d, i, nodes) {
                let s = d3.select(nodes[i]);
                s.append('g')
                    .attr('class', 'legend')
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
                s.select('.legend')
                    .call(legend)
                    .style('fill', color)
                    .style('font-size', '90%');
                if (stroke) {
                    s.selectAll('path.swatch').style('stroke', stroke);
                }
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

    let textblock = function(text) {
        let width = 500;
        let x = 0;
        let y = 0;
        let fill = 'white';
        let baseline = 'top';
        let lineShift = 0;
        let debug = false;

        // internal
        let REF_FONTSIZE = 20;

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                let s = d3.select(nodes[i]);

                let gDebug = s.append('g')
                    .attr('class', 'wb-textblock-debug')

                data = []; // convert to objects
                text.split('\n').forEach(function(d) {
                    data.push({
                        'text': d.trim(),
                    });
                });

                // draw and autoscale text
                let g = s.append('g')
                    .attr('class', 'wb-textblock')

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
                    .call(d3wb.util.makeUnselectable())

                // relocate lines according to bounding box
                g.selectAll('.wb-textblock-line')
                    .each(function(d, i, nodes) {
                        if (i == 0) {
                            return;
                        }
                        d3.select(nodes[i])
                            .attr('y', function(d) {
                                // line over line
                                let y = 0;
                                for (let j = i - 1; j >= 0; j--) {
                                    y = y + nodes[j].getBBox().height;
                                }
                                return y + lineShift * i;
                            })
                            .attr('x', function(d) {
                                // centering
                                let corr = width - nodes[i].getBBox().width;
                                return corr / 2;
                            });
                        d.numberBox = nodes[i].getBBox();
                    });

                let totalHeight = 0;
                data.forEach(function(d, i) {
                    totalHeight += d.numberBox.height;
                    if (i > 0) {
                        totalHeight += lineShift;
                    }
                })

                debugNumbers(s, data, gDebug, totalHeight);

                let yPos = baseline == 'bottom' ?
                    y - totalHeight : y;

                g.attr('transform', 'translate(' + x + ',' + yPos + ')');
                gDebug.attr('transform', 'translate(' + x + ',' + yPos + ')');

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

        let debugNumbers = function(s, data, g, totalHeight) {
            if (!debug) return;

            g.append('circle')
                .attr('r', 4)
                .style('fill', 'yellow')
            g.append('rect')
                .attr('width', width)
                .attr('height', totalHeight)
                .style('fill', 'red')

            g.selectAll('.wb-textblock-line-debug')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'wb-textblock-line-debug')
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
        };

        chart.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return chart;
        };

        chart.fill = function(value) {
            if (!arguments.length) return fill;
            fill = value;
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

        chart.lineShift = function(value) {
            if (!arguments.length) return lineShift;
            lineShift = value;
            return chart;
        };

        chart.debug = function(value) {
            if (!arguments.length) return debug
            debug = value;
            return chart;
        }

        chart.baseline = function(value) {
            if (!arguments.length) return baseline
            baseline = value;
            return chart;
        }

        return chart;
    };


    /* *********************************************************************
     * PUBLIC API
     * ********************************************************************* */

    d3wb.add = {
        xAxis: xAxis,
        xAxisBottom: xAxisBottom,
        xAxisLabel: xAxisLabel,
        yAxis: yAxis,
        yAxisRight: yAxisRight,
        yAxisLabel: yAxisLabel,
        title: title,
        shadow: shadow,
        legend: legend,
        textblock: textblock,
    };

    /* *********************************************************************
     * PRIVATE FUNCTIONS
     * ********************************************************************* */

    let injectAxisColor = function(color, cclass) {
        d3wb.util.injectCSS(`
            .` + cclass + ` line{
              stroke: ` + color + `;
            }
            .` + cclass + ` path{
              stroke: ` + color + `;
            }
            .` + cclass + ` text{
              fill: ` + color + `;
            }
            `);
    };

    let commonAxisElements = function(chart, defaultType) {
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

        c.color = 'red';
        chart.color = function(value) {
            if (!arguments.length) return color;
            c.color = value;
            return chart;
        };

        c.update = function() {};
        chart.update = function(scale) {
            c.update(scale);
        };

        chart.fontSize = function(value) {
            d3wb.util.injectCSS(`
                .wb-axis-x text {
                  font-size: ` + value + `;
              }`);
            return chart;
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

    let appendTickStyle = function(d3a, c) {
        if (c.ticks) {
            d3a.ticks(c.ticks);
        }
        if (c.tickFormat) {
            d3a.tickFormat(c.tickFormat);
        }
    };
})));
