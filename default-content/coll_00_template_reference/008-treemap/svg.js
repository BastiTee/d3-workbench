(function() {

    var cv = d3wb.initConfig().attr("margin", "10 10 10 10")
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {

        var chart = wbTreemap()
            .width(cv.wid)
            .height(cv.hei)
            .colors(d3wb.color.ordinal())
            .fill(d3wb.color.foreground)
        cv.svg.datum(data).call(chart)

        cv.svg.selectAll(".cells")
            .call(wbCooltip().selector(function(d) {
                return d.data.id + "\n" + d.value;
            }))
    });

})()