(function() {

    var cv = d3wb.initConfig()
        .attr("width", 800)
        .attr("height", 400)
        .data("data.csv")
        .initCanvas()


    d3.csv(cv.config.data(), function(error, data) {
        d3wb.plotWordCloud(data, cv, {
            /* no attributes currently */
        })
    });

})()
