(function() {

    var cv = d3wb.initConfig().attr("margin", "20 5 75 50")
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        var col = d3wb.color.category()

        var chart = wbStackedBarChart()
            .width(cv.wid)
            .height(cv.hei)
            .legendFill(d3wb.color.foreground)
            .colors([col[0], col[3], col[7]])
        cv.svg.datum(data).call(chart)

        cv.svg.selectAll(".rects").call(wbCooltip().selector(function(d) {
            var infos = [d.data.id]
            
            infos.push("total: " + d.data.total)
            return infos.join('\n')
        }))


        cv.svg.call(
            d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground))
        cv.svg.call(
            d3wb.add.xAxis(chart.scaleX())
            .y(cv.hei)
            .type(d3.axisBottom)
            .rotation(90)
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