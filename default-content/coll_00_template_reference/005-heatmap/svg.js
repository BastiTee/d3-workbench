(function() {

    var cv = d3wb.initConfig()
        .attr("margin", {
            top: 25,
            right: 5,
            bottom: 80,
            left: 80
        })
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        d3wb.plotHeatmap(data, cv, {
            /* no attributes currently */
        });
    });

}())
