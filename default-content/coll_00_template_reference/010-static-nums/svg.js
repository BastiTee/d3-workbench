(function() {

    var cv = d3wb.config()
        .attr("height", 150)
        .attr("margin.bottom", 20)
        .data("data.json")
        .toCanvas()

    d3.json(cv.data, function(error, data) {

        var chart = wbStaticNumbers()
            .width(cv.wid)
            .height(cv.hei)
            .fillNumber(d3wb.color.category()[1])
            .fillLabel(d3wb.color.category()[6])
        cv.datum(data).call(chart)

    });

}())