(function() {

    var cv = d3wb.initConfig()
        .attr("width", 1000)
        .attr("height", 600)
        .attr("margin.top", 20)
        .attr("margin.bottom", 20)
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {
        d3wb.plotSankeyDiagram(data, cv, {
            /* no attributes currently */
        });
    })

})()
