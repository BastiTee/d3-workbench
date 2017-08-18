(function() {

    var cv = d3wb.initConfig()
        .attr("height", 150)
        .attr("margin.bottom", 20)
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {

        var chart = wbStaticNumbers()
            .width(cv.wid)
            .height(cv.hei)
            .fillNumber(d3wb.color.category()[1])
            .fillLabel(d3wb.color.category()[6])
        cv.svg.datum(data).call(chart)

    });

}())