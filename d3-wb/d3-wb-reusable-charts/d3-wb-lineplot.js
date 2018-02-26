/* exported wbLinePlot */
/**
 * Basic (multi-) line plot.
 * @return {Object} A reusable, updatable chart object.
 */
function wbLinePlot() {
    'use strict';

    let width = 500;
    let height = 500;
    let xAxisScale = d3.scaleLinear();
    let yAxisScale = d3.scaleLinear();
    let xDataPoints = 'x';
    let yDataPoints = ['y'];
    let xDataPointsFormat = function(datum) {
        return datum;
    };
    let yDataPointsFormat = function(datum) {
        return datum;
    };
    let scaleX;
    let scaleY;
    let xMinMax;
    let yMinMax;
    let setYMinToZero = false;
    let stroke = ['red'];
    let strokeWidth = 1;
    let axisColor = 'white';
    let curve = [d3.curveBasis];
    let showLegend = true;
    let legendFill = 'black';
    let legendX = 0;
    let legendY = 0;
    let lineClass;
    let dataPointRadius = 7;
    let dataPointLineFill = 'red';
    let activateTooltip = false;
    let update = function() {};

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);
            let tipBox;

            if (yDataPoints.length * 2 != (curve.length + stroke.length)) {
                throw Error('If you enter more than one y-data-point,' +
                    ' you need to set the curve and stroke options with ' +
                    'equally-sized arrays.');
            }

            if (showLegend) {
                let legend = s.append('g')
                    .attr('font-size', '75%')
                    .attr('text-anchor', 'end')
                    .attr('transform', 'translate(' +
                        legendX + ',' + legendY + ')')
                    .selectAll('g')
                    .data(yDataPoints)
                    .enter().append('g')
                    .call(d3wb.util.makeUnselectable())
                    .attr('transform', function(d, i) {
                        return 'translate(0,' + i * 20 + ')';
                    });

                let rw = 19;
                legend.append('rect')
                    .attr('x', -rw)
                    .attr('width', rw)
                    .attr('height', rw)
                    .attr('fill', function(d, i) {
                        return (stroke[i]);
                    });

                legend.append('text')
                    .attr('x', -rw - 3)
                    .attr('y', 9.5)
                    .attr('dy', '0.32em')
                    .text(function(d) {
                        return d;
                    })
                    .attr('fill', legendFill);
            }

            if (activateTooltip) {
                s.append('line')
                    .attr('class', 'tooltip-line');
                s.append('text')
                    .attr('class', 'tooltip-text')
                    .attr('x', 5)
                    .attr('y', 0)
                    .style('font-size', '85%')
                    .attr('text-anchor', 'start')
                    .attr('dominant-baseline', 'hanging')
                    .style('fill', legendFill);
                yDataPoints.forEach(function(d, i) {
                    s.append('circle')
                        .attr('class', 'tooltip-circle tooltip-circle-' + d);
                });
                tipBox = s.append('rect')
                    .attr('class', 'selector-box')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('opacity', 0);
            }

            update = function(data) {
                if (xMinMax === undefined) {
                    xMinMax = d3.extent(data, function(d) {
                        return d[xDataPoints];
                    });
                }
                if (yMinMax === undefined) {
                    yMinMax = d3.extent(data.map(function(d) {
                        return yDataPoints.map(function(e) {
                            return +d[e];
                        });
                    }).reduce(function(a, b) {
                        return a.concat(b);
                    }));
                    if (setYMinToZero) {
                        yMinMax[0] = 0;
                    }
                }
                scaleX = xAxisScale.rangeRound([0, width]).domain(xMinMax);
                scaleY = yAxisScale.rangeRound([height, 0]).domain(yMinMax);

                yDataPoints.forEach(function(d, i) {
                    let line = d3.line()
                        .curve(curve[i])
                        .x(function(d) {
                            return scaleX(d[xDataPoints]);
                        })
                        .y(function(d) {
                            return scaleY(d[yDataPoints[i]]);
                        });

                    let classs = lineClass ? lineClass :
                        'line-' + yDataPoints[i];
                    if (s.select('.' + classs).empty()) {
                        s.datum(data).append('path')
                            .attr('class', 'line ' + classs)
                            .attr('d', line)
                            .style('fill', 'none')
                            .style('stroke-linecap', 'round')
                            .style('stroke-linejoin', 'round')
                            .style('pointer-events', 'none')

                            .style('stroke-width', strokeWidth)
                            .style('stroke', stroke[i]);
                    } else {
                        s.datum(data).select('.' + classs)
                            .transition().duration(500)
                            .attr('d', line);
                    }
                });
            };

            update(data);

            let drawTooltip = function() {
                let information = [];
                let mouse = d3.mouse(s.node());
                let bisect = d3.bisector(function(d) {
                    return d[xDataPoints];
                }).right;
                let timestamp = scaleX.invert(mouse[0]);
                let index = bisect(data, timestamp);
                let startDatum = data[index - 1];
                information.push(xDataPointsFormat(startDatum[xDataPoints]));
                let endDatum = data[index];
                s.selectAll('.tooltip-line').attr('stroke', 'red')
                    .attr('x1', scaleX(timestamp))
                    .attr('x2', scaleX(timestamp))
                    .attr('y1', 0)
                    .attr('y2', height);
                yDataPoints.forEach(function(d, i) {
                    let interpolate = d3.interpolateNumber(
                        startDatum[yDataPoints[i]], endDatum[yDataPoints[i]]);
                    let range = endDatum[xDataPoints] - startDatum[xDataPoints];
                    let valueY = interpolate((timestamp % range) / range);
                    information.push(d + ' – ' + startDatum[yDataPoints[i]]);
                    s.select('.tooltip-circle-' + d)
                        .attr('cx', scaleX(timestamp))
                        .attr('cy', scaleY(valueY))
                        .attr('r', dataPointRadius)
                        .style('fill', stroke[i])
                        .style('opacity', 1.0);
                });
                let t = s.selectAll('.tooltip-text')
                    .style('opacity', 1.0);
                s.selectAll('.tooltip-text-line').remove();
                for (let i = 0; i < information.length; i++) {
                    t.append('tspan')
                        .attr('class', 'tooltip-text-line')
                        .attr('x', 5)
                        .attr('dy', function() {
                            return i == 0 ? 0 : 15;
                        })
                        .text(information[i]);
                }
            };

            let removeTooltip = function() {
                s.selectAll('.tooltip-line')
                    .attr('stroke', 'none');
                s.selectAll('.tooltip-circle')
                    .style('opacity', 0);
                s.selectAll('.tooltip-text')
                    .style('opacity', 0);
            };

            if (activateTooltip) {
                tipBox
                    .on('mousemove', drawTooltip)
                    .on('mouseout', removeTooltip);
            }
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

    chart.xAxisScale = function(value) {
        if (!arguments.length) return xAxisScale;
        xAxisScale = value;
        return chart;
    };

    chart.yAxisScale = function(value) {
        if (!arguments.length) return yAxisScale;
        yAxisScale = value;
        return chart;
    };

    chart.xDataPoints = function(value) {
        if (!arguments.length) return xDataPoints;
        xDataPoints = value;
        return chart;
    };

    chart.yDataPoints = function(value) {
        if (!arguments.length) return yDataPoints;
        yDataPoints = value.constructor === Array ? value : [value];
        return chart;
    };

    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor;
        axisColor = value;
        return chart;
    };

    chart.stroke = function(value) {
        if (!arguments.length) return stroke;
        stroke = value.constructor === Array ? value : [value];
        return chart;
    };

    chart.curve = function(value) {
        if (!arguments.length) return curve;
        curve = value.constructor === Array ? value : [value];
        return chart;
    };

    chart.scaleX = function() {
        return scaleX;
    };

    chart.scaleY = function() {
        return scaleY;
    };

    chart.update = function(data) {
        update(data);
        return chart;
    };

    chart.xMinMax = function(value) {
        if (!arguments.length) return xMinMax;
        xMinMax = value;
        return chart;
    };

    chart.yMinMax = function(value) {
        if (!arguments.length) return yMinMax;
        yMinMax = value;
        return chart;
    };

    chart.legendFill = function(value) {
        if (!arguments.length) return legendFill;
        legendFill = value;
        return chart;
    };

    chart.legendX = function(value) {
        if (!arguments.length) return legendX;
        legendX = value;
        return chart;
    };

    chart.legendY = function(value) {
        if (!arguments.length) return legendY;
        legendY = value;
        return chart;
    };

    chart.strokeWidth = function(value) {
        if (!arguments.length) return strokeWidth;
        strokeWidth = value;
        return chart;
    };

    chart.setYMinToZero = function(value) {
        if (!arguments.length) return setYMinToZero;
        setYMinToZero = value;
        return chart;
    };

    chart.dataPointLineFill = function(value) {
        if (!arguments.length) return dataPointLineFill;
        dataPointLineFill = value;
        return chart;
    };

    chart.xDataPointsFormat = function(value) {
        if (!arguments.length) return xDataPointsFormat;
        xDataPointsFormat = value;
        return chart;
    };

    chart.yDataPointsFormat = function(value) {
        if (!arguments.length) return yDataPointsFormat;
        yDataPointsFormat = value;
        return chart;
    };

    chart.activateTooltip = function(value) {
        if (!arguments.length) return activateTooltip;
        console.log('ATTENTION: This feature is experimental.');
        activateTooltip = value;
        return chart;
    };

    chart.showLegend = function(value) {
        if (!arguments.length) return showLegend;
        showLegend = value;
        return chart;
    };

    chart.lineClass = function(value) {
        if (!arguments.length) return lineClass;
        lineClass = value;
        return chart;
    };

    return chart;
}
