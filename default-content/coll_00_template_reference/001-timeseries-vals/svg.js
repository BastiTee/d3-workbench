(function() {
    var cv = d3wb.initConfig().attr("margin", "10 90 50 60")
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        const parseDate = d3.timeParse("%Y-%m-%d");
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value
        });
        
        
        var chart = wbTimeseries()
            .width(cv.wid)
            .height(cv.hei)
            .fill(d3wb.color.blue)
            .fillValues(d3wb.color.cyan)
            .fillAxis(d3wb.color.foreground)
            .target("weekday")
            .valueColumn("value")
            
        cv.svg.datum(data).call(chart)
        
        cv.svg.selectAll(".rects").call(wbCooltip().selector(function(d) {
            return d.length + " occurrences"
        }))
        cv.svg.selectAll(".valuerects").call(wbCooltip().selector(function(d) {
            return d3.formatPrefix(".1", 1e6)(d.mean) + " average"
        }))
        
        cv.svg.call(d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground))
        cv.svg.call(d3wb.add.xAxisLabel("Weekday")
            .color(d3wb.color.foreground).orientation("bottom"))
        cv.svg.call(d3wb.add.yAxisLabel("Count")
            .color(d3wb.color.foreground))
        cv.svg.call(d3wb.add.yAxisRight(chart.scaleY2())
            .x(cv.wid).color(d3wb.color.foreground))
        cv.svg.call(d3wb.add.yAxisLabel("Other count")
            .orientation("right").color(d3wb.color.foreground))
        
    });
}())
