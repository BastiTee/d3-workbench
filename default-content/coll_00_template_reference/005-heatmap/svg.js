(function() {

    var cv = d3wb.initConfig().attr("margin", "25 5 80 80")
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {

        
        var start = d3wb.color.cyan.fade(50)
        var end = d3wb.color.red.fade(20)
        var colors = d3wb.color.gradientArray(start, end, 12)
        
        var chart = wbHeatmap()
            .width(cv.wid)
            .height(cv.hei)
            .colors(colors)
            .fill(d3wb.color.foreground)
        cv.svg.datum(data).call(chart)
        
        cv.svg.selectAll(".hour").call(wbCooltip().selector(function(d) {
            return d.value
        }))
    });

}())
