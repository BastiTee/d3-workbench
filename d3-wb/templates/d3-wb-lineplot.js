(function() {
    "use strict";

    d3wb.injectCSS(`
        .basic-stroke {
            fill: none;
            stroke-linejoin: round;
            stroke-linecap: round;
            stroke-width: 1;
        }
    `)

    d3wb.plotLine = function(cv, data, attr) {

        var line = d3.line()
            .x(function(d) {
                return attr.xAxis(d[attr.xDataPoints]);
            })
            .y(function(d) {
                return attr.yAxis(d[attr.yDataPoints]);
            })
        if (attr.smoothing) {
            line.curve(d3.curveBasis)
        }
        var path = cv.svg.append("path")
            .datum(data)
            .attr("d", line)
            .attr("class", "basic-stroke")
            .style("stroke", d3wb.color.red)

        if (attr.addAxis) {
            d3wb.appendXAxis(cv, attr.xAxis)
            d3wb.appendYAxis(cv, attr.yAxis)
        }
    }

})()
