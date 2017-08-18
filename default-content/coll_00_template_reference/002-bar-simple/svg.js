(function() {

    var cv = d3wb.initConfig().attr("margin", "10 10 40 60")
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        var col = d3wb.color.category()

        var chart = wbBarChart()
            .width(cv.wid)
            .height(cv.hei)
            .xSelector("space")
            .ySelector("votes")
            .fill(d3wb.color.blue)
        cv.svg.datum(data).call(chart)

        cv.svg.call(
            d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground))
        cv.svg.call(
            d3wb.add.xAxis(chart.scaleX())
            .y(cv.hei)
            .color(d3wb.color.foreground))
        cv.svg.call(
            d3wb.add.xAxisLabel("Storage size")
            .color(d3wb.color.foreground)
            .orientation("bottom"))
        cv.svg.call(
            d3wb.add.yAxisLabel("Number of users")
            .color(d3wb.color.foreground))
    })

})()