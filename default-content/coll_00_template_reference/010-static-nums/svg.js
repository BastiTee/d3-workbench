(function() {

    var cv = d3wb.initConfig()
        .attr("width", 800)
        .attr("height", 140)
        .attr("margin.bottom", 20)
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {
        d3wb.plotStaticNumbers(data, cv, {
            /* attributes */
        });
    });

}())
