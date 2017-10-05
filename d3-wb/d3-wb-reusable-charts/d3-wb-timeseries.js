function wbTimeseries() {
    "use strict";

    // %a - abbreviated weekday name.*
    // %c - the locale’s date and time, such as %x, %X.*
    // %b - abbreviated month name.*
    // %A - full weekday name.*
    // %B - full month name.*
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

    var width = 500
    var height = 500
    var target = "hour"
    var fill = "red"
    var fillValues = "orange"
    var fillAxis = "black"
    var valueColumn = undefined
    var valueColumnAggregation = d3.mean
    var xSelector = "x"
    var ySelector = "y"
    var scaleX
    var scaleY
    var scaleY2

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

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
                return d[target]
            })

            // console.log(target);
            // console.log(minMax);

            if (target == "month") {
                var xAxisTicks = d3.timeMonths(
                    new Date(2017, 0, 1), new Date(2017, 11, 31))
                var xAxisFormat = d3.timeFormat("%B")
            } else if (target == "year") {
                var xAxisTicks = d3.timeYears(new Date(minMax[0], 0, 1),
                    new Date(minMax[1], 12, 1))
                var xAxisFormat = function(f) {
                    return f
                }
                var sub = []
                xAxisTicks.forEach(function(d) {
                    sub.push(d.getFullYear())
                })
                xAxisTicks = sub
            } else if (target == "weekday") {
                var xAxisTicks = [0, 1, 2, 3, 4, 5, 6]
                var xAxisFormat = d3.timeFormat("%A")
            } else if (target == "day") {
                var xAxisTicks = d3.timeDays(
                    minMaxData[0], minMaxData[1])
                var xAxisFormat = d3.timeFormat("%d.%m.%Y")
            } else if (target == "minute-of-day") {
                var xAxisTicks = d3.timeMinutes(
                    minMaxData[0] - 60 * 1000, minMaxData[1])
                var xAxisFormat = d3.timeFormat("%H:%M")
            }

            scaleX = d3.scaleOrdinal().domain(xAxisTicks).range(
                d3.range(0, width, width / xAxisTicks.length));

            var padding1 = (width / xAxisTicks.length) * 0.1;

            var histogram = d3.histogram().value(function(d) {
                return d[target]
            }).thresholds(xAxisTicks)

            var bins = histogram(data);

            var maxVals = d3.max(bins, function(d) {
                return d.length;
            });


            scaleY = d3.scaleLinear()
                .range([height, 0])
                .domain([0, maxVals + 1]);

            var minMax = d3.extent(bins, function(d) {
                return d.length;
            })

            var barwid = width / xAxisTicks.length - padding1

            s.selectAll("rect")
                .data(bins)
                .enter().append("rect")
                .attr("class", "rects")
                .attr("x", 0)
                .attr("fill", function(d) {
                    return fill
                })
                .attr("transform", function(d) {
                    return "translate(" + scaleX(d.x0) + "," + scaleY(d.length) + ")";
                })
                .attr("width", function(d) {
                    return barwid
                })
                .attr("height", function(d) {
                    return height - scaleY(d.length);
                })

            if (valueColumn) {

                bins.forEach(function(d) {
                    var values = [];
                    d.forEach(function(s) {
                        values = values.concat(s.value);
                    });
                    d.mean = valueColumnAggregation(values)
                });
                var x = d3.scaleOrdinal().domain(xAxisTicks).range(
                    d3.range(0, width, width / xAxisTicks.length));
                var padding2 = (width / xAxisTicks.length) * 0.8;

                var maxVals = d3.max(bins, function(d) {
                    return d.mean;
                });
                scaleY2 = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, maxVals + 1]);

                s.selectAll(".dim")
                    .data(bins)
                    .enter().append("rect")
                    .attr("class", "valuerects")
                    .attr("fill", function(d) {
                        return fillValues
                    })
                    .attr("transform", function(d) {
                        var mid = barwid / 2 - (width / xAxisTicks.length) * 0.1
                        // - padding/2
                        return "translate(" + (x(d.x0) + mid) + "," + scaleY2(d.mean) + ")";
                    })
                    .attr("width", function(d) {
                        return width / xAxisTicks.length - padding2
                    })
                    .attr("height", function(d) {
                        return height - scaleY2(d.mean);
                    })
            }

            // manually generate the discrete x-axis
            var bar = s.append("g")
                .attr("transform", "translate(0," + height + ")")
                .selectAll("xaxis").data(bins).enter()

            bar.append("line")
                .attr("x1", 0).attr("x2", width).style("stroke",
                    fillAxis)

            bar.append("text").text(function(d, i) {
                    if (target != 'weekday') {
                        return xAxisFormat(xAxisTicks[i])
                    } else {
                        // artifical dates 
                        var xForm = d3.timeDays(new Date(2017, 0, 1),
                            new Date(2017, 0, 8))
                        return xAxisFormat(xForm[xAxisTicks[i]])
                    }
                })
                .style("text-anchor", "middle")
                .style("font-size", "70%")
                .style("fill", fillAxis)
                .attr("x", function(d, i) {
                    return i * (width / xAxisTicks.length) + (width / xAxisTicks.length / 2) - (padding1 / 2)
                }).attr("y", function(d) {
                    return this.getBBox().height + 5
                })

            bar.append("line")
                .attr("x1", function(d, i) {
                    return i * (width / xAxisTicks.length) + (width / xAxisTicks.length / 2) - (padding1 / 2)
                }).attr("x2", function(d, i) {
                    return i * (width / xAxisTicks.length) + (width / xAxisTicks.length / 2) - (padding1 / 2)
                }).attr("y1", 0).attr("y2", 5).style("stroke",
                    fillAxis)
        })
    }

    chart.width = function(value) {
        if (!arguments.length) return width
        width = value;
        return chart;
    }

    chart.height = function(value) {
        if (!arguments.length) return height
        height = value;
        return chart;
    }

    chart.target = function(value) {
        if (!arguments.length) return target
        target = value;
        return chart;
    }

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    chart.fillValues = function(value) {
        if (!arguments.length) return fillValues
        fillValues = value;
        return chart;
    }

    chart.fillAxis = function(value) {
        if (!arguments.length) return fillAxis
        fillAxis = value;
        return chart;
    }

    chart.scaleX = function(value) {
        if (!arguments.length) return scaleX
        scaleX = value;
        return chart;
    }

    chart.scaleY = function(value) {
        if (!arguments.length) return scaleY
        scaleY = value;
        return chart;
    }

    chart.scaleY2 = function(value) {
        if (!arguments.length) return scaleY2
        scaleY2 = value;
        return chart;
    }

    chart.valueColumn = function(value) {
        if (!arguments.length) return valueColumn
        valueColumn = value;
        return chart;
    }
    
    chart.valueColumnAggregation = function(value) {
        if (!arguments.length) return valueColumnAggregation
        valueColumnAggregation = value;
        return chart;
    }

    return chart
}