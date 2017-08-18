(function() {

    var cv = d3wb.initConfig()
        .data("data.csv")
        .initCanvas()


    d3.csv(cv.config.data(), function(error, data) {
        d3wb.plotWordCloud(data, cv, {
            /* no attributes currently */
        })
    });

})()
