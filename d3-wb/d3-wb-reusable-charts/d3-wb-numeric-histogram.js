function wbNumericHistogram() {
    "use strict";

    var width = 500
    var height = 500
    var barColor = "red"
    var axisColor = "white"
    var numBins = 50
    var updateCallback = function() {}

    function chart(selection) {

        selection.each(function(data, i) {
            var sel = d3.select(this)
            var xMinMaxNew;
            var xMinMax = d3.extent(data, function(d) {
                return d.value
            })
            var x = d3.scaleLinear().rangeRound([0, width])
            var t = sel.transition().duration(750);
            var y = d3.scaleLinear().rangeRound([height, 0]);
            var xAxis = d3.axisBottom(x)
            var yAxis = d3.axisLeft(y)


            var brush = d3.brushX()
                .extent([
                    [0, 0],
                    [width, height]
                ])
                .on("end", brushed)
            var clickTimeout = null
            var clickDelay = 350;
            var brushgroup = sel.append("g")
                .attr("class", "brush")
                .call(brush);
            var rectg = sel.append("g")
            sel.append("g")
                .attr("transform", "translate(0," + height + ")")
                .attr("class", "axis axis-x")
            sel.append("g")
                .attr("class", "axis axis-y")
                
            draw(xMinMax)

            function draw(xMinMax) {
                x.domain(xMinMax)
                var bins = d3.histogram()
                    .value(function(d) {
                        return d.value
                    })
                    .domain(x.domain())
                    .thresholds(x.ticks(numBins))
                    (data);

                var yMinMax = d3.extent(bins, function(d) {
                    return d.length
                })
                y.domain(yMinMax)

                var rects = rectg.selectAll(".bar")
                    .remove()
                    .exit()
                    .data(bins)

                rects.enter().append("rect")
                    .attr("class", "bar")
                    .attr("fill", barColor)
                    .attr("width", function(d, i) {
                        var wid = width / bins.length
                        var pad = wid * 0.1
                        wid = wid - pad
                        return wid
                    })
                    .attr("height", function(d) {
                        return height - y(d.length);
                    })
                    .attr("y", function(d) {
                        return y(d.length)
                    })
                    .transition(t)
                    .attr("x", function(d) {
                        return x(d.x0)
                    })

                sel.select(".axis-x").transition(t).call(xAxis);
                sel.select(".axis-y").transition(t).call(yAxis);

                sel.selectAll(".axis line")
                    .attr("stroke", axisColor)
                sel.selectAll(".axis path")
                    .attr("stroke", axisColor)
                sel.selectAll(".axis text")
                    .attr("fill", axisColor)

                updateCallback()

            }

            function brushed() {
                var s = d3.event.selection; // get selection.. 
                if (!s) { // if selection is empty ...
                    // if not active, set a timeout and return...
                    if (!clickTimeout) {
                        return clickTimeout = setTimeout(notClicked, clickDelay)
                    }
                    // if click timeout not reached, then reset x selection
                    xMinMaxNew = xMinMax
                } else {
                    // get min max values corresponding to current selection
                    xMinMaxNew = [
                        x.invert(s[0]) < xMinMax[0] ?
                        xMinMax[0] : x.invert(s[0]),
                        x.invert(s[1]) > xMinMax[1] ?
                        xMinMax[1] : x.invert(s[1])
                    ]
                    sel.select(".brush").call(brush.move, null);
                }
                brushedEnd();
            }

            function notClicked() {
                clickTimeout = null;
            }

            function brushedEnd() {
                draw(xMinMaxNew)
            }
        })

    }

    chart.height = function(value) {
        if (!arguments.length) return height
        height = value;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return width
        width = value;
        return chart;
    }

    chart.barColor = function(value) {
        if (!arguments.length) return barColor
        barColor = value;
        return chart;
    }

    chart.axisColor = function(value) {
        if (!arguments.length) return axisColor
        axisColor = value;
        return chart;
    }

    chart.numBins = function(value) {
        if (!arguments.length) return numBins
        numBins = value;
        return chart;
    }
    
    chart.updateCallback = function(value) {
        if (!arguments.length) return updateCallback
        updateCallback = value;
        return chart;
    }

    return chart
}