(function() {

    var cv = d3wb.initConfig().attr("margin", "10 10 50 60")
        .data("data.txt")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        data.forEach(function(d) {
            d.date = new Date(+d.date);
        });

        var chart = wbTimeseries()
            .width(cv.wid)
            .height(cv.hei)
            .fill(d3wb.color.blue)
            .fillAxis(d3wb.color.foreground)
            .target("minute-of-day")

        cv.svg.datum(data).call(chart)
        cv.svg.selectAll(".rects").call(wbCooltip().selector(function(d) {
            return d.length
        }))
        cv.svg.call(d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground))
        cv.svg.call(d3wb.add.xAxisLabel("Minute")
            .color(d3wb.color.foreground).orientation("bottom"))
        cv.svg.call(d3wb.add.yAxisLabel("Count")
            .color(d3wb.color.foreground))

    })

})()