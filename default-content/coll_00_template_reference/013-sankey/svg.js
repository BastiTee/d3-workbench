(function() {

    var cv = d3wb.initConfig().attr("margin", "20 20 20 20")
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {

        var chart = wbSankeyDiagram()
            .width(cv.wid)
            .height(cv.hei)
            .fill(d3wb.color.foreground)
            .colors(d3wb.color.ordinal())
        cv.svg.datum(data).call(chart)

    })

})()