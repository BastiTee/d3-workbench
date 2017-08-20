(function() {

    var cv = d3wb.config().attr("margin", "25 5 80 80")
        .data("data.csv")
        .toCanvas()

    d3.csv(cv.data, function(error, data) {

        var start = d3wb.color.cyan.fade(50)
        var end = d3wb.color.red.fade(20)
        var colors = d3wb.color.gradientArray(start, end, 12)

        var chart = wbHeatMap()
            .width(cv.wid)
            .height(cv.hei)
            .colors(colors)
            .fill(d3wb.color.foreground)
        cv.datum(data).call(chart)

        cv.selectAll(".hour").call(
            wbCooltip().selector(function(d) {
                return d.value
            }))
    });

}())