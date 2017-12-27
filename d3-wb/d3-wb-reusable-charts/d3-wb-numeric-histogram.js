/* exported wbNumericHistogram */
/**
 * Numeric histogram with zoom functionality.
 * @return {Object} A reusable, updatable chart object.
 */
function wbNumericHistogram() {
    'use strict';

    let width = 500;
    let height = 500;
    let barColor = 'red';
    let axisColor = 'white';
    let numBins = 50;
    let updateCallback = function() {};

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let sel = d3.select(nodes[i]);

            let xMinMaxNew;
            let xMinMax = d3.extent(data, function(d) {
                return d.value;
            });
            let x = d3.scaleLinear().rangeRound([0, width]);
            let t = sel.transition().duration(750);
            let y = d3.scaleLinear().rangeRound([height, 0]);
            let xAxis = d3.axisBottom(x);
            let yAxis = d3.axisLeft(y);


            let brush = d3.brushX()
                .extent([
                    [0, 0],
                    [width, height],
                ])
                .on('end', brushed);
            let clickTimeout = null;
            let clickDelay = 350;
            sel.append('g')
                .attr('class', 'brush')
                .call(brush);
            let rectg = sel.append('g');
            sel.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .attr('class', 'axis axis-x');
            sel.append('g')
                .attr('class', 'axis axis-y');

            draw(xMinMax);

            /**
             * tbd
             * @param {*} xMinMax
             */
            function draw(xMinMax) {
                x.domain(xMinMax);
                let bins = d3.histogram()
                    .value(function(d) {
                        return d.value;
                    })
                    .domain(x.domain())
                    .thresholds(x.ticks(numBins))(data);

                let yMinMax = d3.extent(bins, function(d) {
                    return d.length;
                });
                y.domain(yMinMax);

                let rects = rectg.selectAll('.bar')
                    .remove()
                    .exit()
                    .data(bins);

                rects.enter().append('rect')
                    .attr('class', 'bar')
                    .attr('fill', barColor)
                    .attr('width', function(d, i) {
                        let wid = width / bins.length;
                        let pad = wid * 0.1;
                        wid = wid - pad;
                        return wid;
                    })
                    .attr('height', function(d) {
                        return height - y(d.length);
                    })
                    .attr('y', function(d) {
                        return y(d.length);
                    })
                    .transition(t)
                    .attr('x', function(d) {
                        return x(d.x0);
                    });

                sel.select('.axis-x').transition(t).call(xAxis);
                sel.select('.axis-y').transition(t).call(yAxis);

                sel.selectAll('.axis line')
                    .attr('stroke', axisColor);
                sel.selectAll('.axis path')
                    .attr('stroke', axisColor);
                sel.selectAll('.axis text')
                    .attr('fill', axisColor);

                updateCallback();
            };

            /**
             * Called when brush function begins.
             * @return {number} The current click timeout.
             */
            function brushed() {
                let s = d3.event.selection; // get selection..
                if (!s) { // if selection is empty ...
                    // if not active, set a timeout and return...
                    if (!clickTimeout) {
                        return clickTimeout =
                        setTimeout(notClicked, clickDelay);
                    }
                    // if click timeout not reached, then reset x selection
                    xMinMaxNew = xMinMax;
                } else {
                    // get min max values corresponding to current selection
                    xMinMaxNew = [
                        x.invert(s[0]) < xMinMax[0] ?
                        xMinMax[0] : x.invert(s[0]),
                        x.invert(s[1]) > xMinMax[1] ?
                        xMinMax[1] : x.invert(s[1]),
                    ];
                    sel.select('.brush').call(brush.move, null);
                }
                brushedEnd();
            };

            /**
             * Reset click timeout.
             */
            function notClicked() {
                clickTimeout = null;
            };

            /**
             * Called when brush action has ended.
             */
            let brushedEnd = function() {
                draw(xMinMaxNew);
            };
        });
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.barColor = function(value) {
        if (!arguments.length) return barColor;
        barColor = value;
        return chart;
    };

    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor;
        axisColor = value;
        return chart;
    };

    chart.numBins = function(value) {
        if (!arguments.length) return numBins;
        numBins = value;
        return chart;
    };

    chart.updateCallback = function(value) {
        if (!arguments.length) return updateCallback;
        updateCallback = value;
        return chart;
    };

    return chart;
};
