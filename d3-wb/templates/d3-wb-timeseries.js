(function() {
    "use strict";

    // %a - abbreviated weekday name.*
    // %A - full weekday name.*
    // %b - abbreviated month name.*
    // %B - full month name.*
    // %c - the locale’s date and time, such as %x, %X.*
    // %d - zero-padded day of the month as a decimal number [01,31].
    // %e - space-padded day of the month as a decimal number [ 1,31];
    // %H - hour (24-hour clock) as a decimal number [00,23].
    // %I - hour (12-hour clock) as a decimal number [01,12].
    // %j - day of the year as a decimal number [001,366].
    // %m - month as a decimal number [01,12].
    // %M - minute as a decimal number [00,59].
    // %L - milliseconds as a decimal number [000, 999].
    // %p - either AM or PM.*
    // %S - second as a decimal number [00,61].
    // %U - Sunday-based week of the year as a decimal number [00,53].
    // %w - Sunday-based weekday as a decimal number [0,6].
    // %W - Monday-based week of the year as a decimal number [00,53].
    // %x - the locale’s date, such as %-m/%-d/%Y.*
    // %X - the locale’s time, such as %-I:%M:%S %p.*
    // %y - year without century as a decimal number [00,99].
    // %Y - year with century as a decimal number.
    // %Z - time zone offset, such as -0700, -07:00, -07, or Z.
    // %% - a literal percent sign (%).

    d3wb.plotTimeSeriesHistogram = function(data, cv, attr) {

        var minMaxData = d3.extent(data, function(d) {
            return d.date
        })

        data.forEach(function(d) {
            d["month"] = d.date.getMonth()
            d["year"] = d.date.getFullYear()
            d["weekday"] = d.date.getDay()
            d["hour"] = d.date.getHours()
            d["minute"] = d.date.getMinutes()
            d["day"] = new Date(d.date).setHours(0, 0, 0, 0)
            d["minute-of-day"] = new Date(d.date).setSeconds(0, 0)
        });
        var minMax = d3.extent(data, function(d) {
            return d[attr.target]
        })

        // console.log(attr.target);
        // console.log(minMax);

        if (attr.target == "month") {
            var xAxisTicks = d3.timeMonths(
                new Date(2017, 0, 1), new Date(2017, 11, 31))
            var xAxisFormat = d3.timeFormat("%B")
        } else if (attr.target == "year") {
            var xAxisTicks = d3.timeYears(new Date(minMax[0], 0, 1),
                new Date(minMax[1], 31, 12))
            var xAxisFormat = d3.timeFormat("%Y")
        } else if (attr.target == "weekday") {
            var xAxisTicks = [0, 1, 2, 3, 4, 5, 6]
            var xAxisFormat = d3.timeFormat("%A")
        } else if (attr.target == "day") {
            var xAxisTicks = d3.timeDays(
                minMaxData[0], minMaxData[1])
            var xAxisFormat = d3.timeFormat("%d.%m.%Y")
        } else if (attr.target == "minute-of-day") {
            var xAxisTicks = d3.timeMinutes(
                minMaxData[0] - 60 * 1000, minMaxData[1])
            var xAxisFormat = d3.timeFormat("%H:%M")
        }

        var x1 = d3.scaleOrdinal().domain(xAxisTicks).range(
            d3.range(0, cv.wid, cv.wid / xAxisTicks.length));

        var padding1 = (cv.wid / xAxisTicks.length) * 0.1;

        var histogram = d3.histogram().value(function(d) {
            return d[attr.target]
        }).thresholds(xAxisTicks)

        var bins = histogram(data);

        var maxVals = d3.max(bins, function(d) {
            return d.length;
        });


        var y = d3.scaleLinear()
            .range([cv.hei, 0])
            .domain([0, maxVals + 1]);

        var minMax = d3.extent(bins, function(d) {
            return d.length;
        })
        var colors = d3wb.getLinearColorGradient(minMax, [d3wb.color.blue, d3wb.color.blue.fade(20)])

        cv.barwid = cv.wid / xAxisTicks.length - padding1

        var tt = d3wb.tooltip(cv, {
            selector: function(d) {
                return xAxisFormat(d.x0) + "\n" + d.length
            }
        })

        cv.svg.selectAll("rect")
            .data(bins)
            .enter().append("rect")
            .attr("x", 0)
            .attr("fill", function(d) {
                return colors(d.length)
            })
            .attr("transform", function(d) {
                return "translate(" + x1(d.x0) + "," + y(d.length) + ")";
            })
            .attr("width", function(d) {
                return cv.barwid
            })
            .attr("height", function(d) {
                return cv.hei - y(d.length);
            })
            .on("mouseover", tt.mouseover)
            .on("mousemove", tt.mousemove)
            .on("mouseout", tt.mouseout)

        d3wb.appendYAxis(cv, y)
        d3wb.appendTitle(cv, attr.title)
        d3wb.appendXAxisLabel(cv, attr.xLabel)
        d3wb.appendRotatedYAxisLabel(cv, attr.yLabel)

        if (attr.valueColumn) {

            bins.forEach(function(d) {
                var values = [];
                d.forEach(function(s) {
                    values = values.concat(s.value);
                });
                d.mean = d3.mean(values)
            });
            var x = d3.scaleOrdinal().domain(xAxisTicks).range(
                d3.range(0, cv.wid, cv.wid / xAxisTicks.length));
            var padding2 = (cv.wid / xAxisTicks.length) * 0.8;

            var maxVals = d3.max(bins, function(d) {
                return d.mean;
            });
            var y = d3.scaleLinear()
                .range([cv.hei, 0])
                .domain([0, maxVals + 1]);

            var tt2 = d3wb.tooltip(cv, {
                selector: function(d) {
                    return xAxisFormat(d.x0) + "\n" +
                        d3.formatPrefix(".1", 1e6)(d.mean)
                }
            })

            cv.svg.selectAll(".dim")
                .data(bins)
                .enter().append("rect")
                .attr("fill", function(d) {
                    return d3wb.color.red
                })
                .attr("transform", function(d) {
                    var mid = cv.barwid / 2 - (cv.wid / xAxisTicks.length) * 0.1
                    // - padding/2
                    return "translate(" + (x(d.x0) + mid) + "," + y(d.mean) + ")";
                })
                .attr("width", function(d) {
                    return cv.wid / xAxisTicks.length - padding2
                })
                .attr("height", function(d) {
                    return cv.hei - y(d.mean);
                })
                .on("mouseover", tt2.mouseover)
                .on("mousemove", tt2.mousemove)
                .on("mouseout", tt2.mouseout)

            d3wb.appendYAxisRight(cv, y)
            d3wb.appendRotatedYAxisLabelRight(cv, attr.yLabel2)

        }
        
        // manually generate the discrete x-axis
        var bar = cv.svg.append("g")
            .attr("transform", "translate(0," + cv.hei + ")")
            .selectAll("xaxis").data(bins).enter()

        bar.append("line")
            .attr("x1", 0).attr("x2", cv.wid).style("stroke",
                d3wb.color.foreground)

        bar.append("text").text(function(d, i) {
                if (attr.target != 'weekday') {
                    return xAxisFormat(xAxisTicks[i])
                } else {
                    // artifical dates 
                    var xForm = d3.timeDays(new Date(2017, 0, 1),
                        new Date(2017, 0, 8))
                    return xAxisFormat(xForm[xAxisTicks[i]])
                    return ""
                }
            })
            .style("text-anchor", "middle")
            .style("font-size", "70%")
            .style("fill", d3wb.color.foreground)
            .attr("x", function(d, i) {
                return i * (cv.wid / xAxisTicks.length) + (cv.wid / xAxisTicks.length / 2) - (padding1 / 2)
            }).attr("y", function(d) {
                return this.getBBox().height + 5
            })

        bar.append("line")
            .attr("x1", function(d, i) {
                return i * (cv.wid / xAxisTicks.length) + (cv.wid / xAxisTicks.length / 2) - (padding1 / 2)
            }).attr("x2", function(d, i) {
                return i * (cv.wid / xAxisTicks.length) + (cv.wid / xAxisTicks.length / 2) - (padding1 / 2)
            }).attr("y1", 0).attr("y2", 5).style("stroke",
                d3wb.color.foreground)

    }
})()