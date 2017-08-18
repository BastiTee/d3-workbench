(function() {

    var cv = d3wb.initConfig().attr("margin", "20 20 20 20")
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {
        d3wb.plotSankeyDiagram(data, cv, {
            /* no attributes currently */
        });
    })

})()
