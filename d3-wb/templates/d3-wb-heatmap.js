(function() {
    "use strict";

    d3wb.plotHeatmap = function(data, cv, attr) {

        attr.quantiles = attr.quantiles || 12

        data.forEach(function(d) {
            d.day = +d.day
            d.hour = +d.hour
            d.value = +d.value
        });

        var numHours = 24
        var times = Array(numHours)
        for (var i = 0; i < times.length; i++) {
            times[i] = i + "";
        }
        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        var gridSizeX = Math.floor(cv.wid / numHours);
        var gridSizeY = Math.floor(cv.hei / days.length);

        var dayLabels = cv.svg.selectAll(".dayLabel")
            .data(days)
            .enter().append("text")
            .text(function(d) {
                return d;
            })
            .attr("x", 0)
            .attr("y", function(d, i) {
                return i * gridSizeY;
            })
            .style("text-anchor", "end")
            .style("fill", d3wb.color.foreground)
            .attr("alignment-baseline", "middle")
            .attr("transform", "translate(-6," + gridSizeY / 2 + ")")

        var timeLabels = cv.svg.selectAll(".timeLabel")
            .data(times)
            .enter().append("text")
            .text(function(d) {
                return d;
            })
            .attr("x", function(d, i) {
                return i * gridSizeX;
            })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .style("fill", d3wb.color.foreground)
            .attr("transform", "translate(" + gridSizeX / 2 + ", -6)")

        var heatMap = cv.svg.selectAll(".hour")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d) {
                return (d.hour) * gridSizeX;
            })
            .attr("y", function(d) {
                return (d.day - 1) * gridSizeY;
            })
            .attr("class", "hour bordered")
            .attr("width", gridSizeX)
            .attr("height", gridSizeY)
            .attr("stroke", d3wb.color.foreground)
            .attr("stroke-width", "1")
            .style("fill", d3wb.color.grey)
            .call(d3wb.tooltip, {
                selector: function(d) {
                    return d.value
                },
                root: cv
            })

        var minMax = d3.extent(data, function(d) {
            return d.value;
        })

        var start = d3wb.color.cyan.fade(50)
        var end = d3wb.color.red.fade(20)
        var colors = d3wb.getGradientAsArray(start, end, attr.quantiles)
        var colorScale = d3wb.getColorsQuantile(minMax, colors)

        heatMap.style("fill", function(d) {
            return colorScale(d.value);
        });

        var legend = cv.svg.selectAll(".legend")
            .data([0].concat(colorScale.quantiles()), function(d) {
                return d;
            })
            .enter().append("g")

        legend.append("rect")
            .attr("x", function(d, i) {
                return gridSizeX * 2 * i;
            })
            .attr("y", cv.hei + 10)
            .attr("width", gridSizeX * 2)
            .attr("height", gridSizeY / 2)
            .attr("stroke", d3wb.color.foreground)
            .attr("stroke-width", "1")
            .style("fill", function(d, i) {
                return colors[i];
            });

        legend.append("text")
            .attr("alignment-baseline", "hanging")
            .text(function(d) {
                return "≥ " + Math.round(d);
            })
            .attr("x", function(d, i) {
                return gridSizeX * 2 * i;
            })
            .attr("y", cv.hei + gridSizeY)
            .style("fill", d3wb.color.foreground)

    };

})(d3wb)