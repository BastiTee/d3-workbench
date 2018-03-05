/* exported wbScatterPlot */
/**
 * Basic scatter plot.
 * @return {Object} A reusable, updatable chart object.
 */
function wbScatterPlot() {
    'use strict';

    let width = 500;
    let height = 500;

    let xDataPoints = 'x';
    let yDataPoints = 'y';
    let zDataPoints;

    let xAxisScale = d3.scaleLinear();
    let yAxisScale = d3.scaleLinear();
    let zAxisScale = d3.scaleLinear();

    let color;
    let colorLow = 'green';
    let colorHigh = 'red';

    let opacityDataPoints = undefined;
    let opacityRange = [0.0, 1.0];

    let update = function() {};

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);
            let rsize = 8;

            let xMinMax = d3.extent(data, function(d) {
                return d[xDataPoints];
            });
            let yMinMax = d3.extent(data, function(d) {
                return d[yDataPoints];
            });
            zDataPoints = zDataPoints || xDataPoints;
            let zMinMax = d3.extent(data, function(d) {
                return d[zDataPoints];
            });

            s.selectAll('.scatter-datapoint')
                .data(data).enter()
                .append('rect')
                .attr('class', 'scatter-datapoint')
                .attr('width', rsize)
                .attr('height', rsize)
                .attr('rx', 5);

            let x;
            let y;
            let z;
            let o;

            update = function(first) {
                first = first || false;

                if (opacityDataPoints !== undefined) {
                    o = d3.scaleLog()
                        .domain(d3.extent(data, function(d) {
                            return d[opacityDataPoints];
                        })).range(opacityRange);
                }
                x = xAxisScale.range([0, width]).domain(xMinMax);
                y = yAxisScale.range([height, 0]).domain(yMinMax);
                z = zAxisScale.domain(zMinMax)
                    .interpolate(d3.interpolate)
                    .range([colorLow, colorHigh]);

                let up;
                if (first) {
                    up = s.selectAll('.scatter-datapoint');
                } else {
                    up = s.selectAll('.scatter-datapoint')
                        .transition().duration(500);
                }

                up.attr('opacity', function(d) {
                        if (opacityDataPoints !== undefined) {
                            return o(d[opacityDataPoints]);
                        }
                        return 1.0;
                    })
                    .attr('x', function(d) {
                        return x(d[xDataPoints]) - rsize / 2;
                    })
                    .attr('y', function(d) {
                        return y(d[yDataPoints]) - rsize / 2;
                    })
                    .style('fill', function(d) {
                        return z(d[zDataPoints]);
                    });
            };
            update(true);
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

    chart.zAxisScale = function(value) {
        if (!arguments.length) return zAxisScale;
        zAxisScale = value;
        return chart;
    };

    chart.xDataPoints = function(value) {
        if (!arguments.length) return xDataPoints;
        xDataPoints = value;
        return chart;
    };

    chart.yDataPoints = function(value) {
        if (!arguments.length) return yDataPoints;
        yDataPoints = value;
        return chart;
    };

    chart.zDataPoints = function(value) {
        if (!arguments.length) return zDataPoints;
        zDataPoints = value;
        return chart;
    };

    chart.opacityDataPoints = function(value) {
        if (!arguments.length) return opacityDataPoints;
        opacityDataPoints = value;
        return chart;
    };

    chart.opacityRange = function(value) {
        if (!arguments.length) return opacityRange;
        opacityRange = value;
        return chart;
    };

    chart.colorLow = function(value) {
        if (!arguments.length) return colorLow;
        colorLow = value;
        return chart;
    };

    chart.colorHigh = function(value) {
        if (!arguments.length) return colorHigh;
        colorHigh = value;
        return chart;
    };

    chart.color = function(value) {
        if (!arguments.length) return color;
        colorLow = value;
        colorHigh = value;
        return chart;
    };

    chart.update = function() {
        update();
        return chart;
    };

    return chart;
}
