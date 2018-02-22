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
        let color = 'red';
        let type = d3.axisTop;
        let y = 0;
        let x = 0;
        let ticks;
        let rotation = undefined;

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                injectAxisColor(color, 'wb-axis-x');
                let s = d3.select(nodes[i]);
                let d3a = type(scale);
                if (ticks) {
                    d3a.ticks(ticks);
                }
                let axis = s.append('g')
                    .attr('transform', 'translate(' + x + ',' + y + ')')
                    .attr('class', 'wb-axis wb-axis-x')
                    .call(d3wb.util.makeUnselectable())
                    .call(d3a);
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

        chart.type = function(value) {
            if (!arguments.length) return type;
            type = value;
            return chart;
        };

        chart.ticks = function(value) {
            if (!arguments.length) return ticks;
            ticks = value;
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

        chart.color = function(value) {
            if (!arguments.length) return color;
            color = value;
            return chart;
        };

        chart.rotation = function(value) {
            if (!arguments.length) return rotation;
            rotation = value;
            return chart;
        };

        chart.scale = function(value) {
            if (!arguments.length) return scale;
            scale = value;
            return chart;
        };

        chart.fontSize = function(value) {
            d3wb.util.injectCSS(`
                .wb-axis-x text {
                  font-size: ` + value + `;
              }`);
            return chart;
        };

        return chart;
    };

    let xAxisBottom = function(scale) {
        return xAxis(scale).type(d3.axisBottom);
    };

    let yAxis = function(scale) {
        // configurable
        let color = 'red';
        let type = d3.axisLeft;
        let x = 0;
        let format = function(scale) {
            return scale;
        };
        // internal
        let update = function() {};
        let g;

        let chart = function(selection) {
            selection.each(function(data, i, nodes) {
                injectAxisColor(color, 'wb-axis-y');
                let s = d3.select(nodes[i]);
                g = s.append('g')
                    .attr('class', 'wb-axis wb-axis-y')
                    .attr('transform', 'translate(' + x + ',0)')
                    .call(d3wb.util.makeUnselectable());
                update = function(scale) {
                    g.call(format(type(scale)));
                };
                update(scale);
            });
        };

        chart.update = function(scale) {
            update(scale);
            return chart;
        };

        chart.format = function(value) {
            if (!arguments.length) return format;
            format = value;
            return chart;
        };

        chart.type = function(value) {
            if (!arguments.length) return type;
            type = value;
            return chart;
        };

        chart.x = function(value) {
            if (!arguments.length) return x;
            x = value;
            return chart;
        };

        chart.color = function(value) {
            if (!arguments.length) return color;
            color = value;
            return chart;
        };

        chart.scale = function(value) {
            if (!arguments.length) return scale;
            scale = value;
            return chart;
        };

        chart.fontSize = function(value) {
            d3wb.util.injectCSS(`
                .wb-axis-y text {
                  font-size: ` + value + `;
              }`);
            return chart;
        };

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
})));
