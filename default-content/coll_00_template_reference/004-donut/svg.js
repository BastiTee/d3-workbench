(function() {

    var cv = d3wb.initConfig()
        .attr("width", 500)
        .attr("margin.right", 100)
        // .attr("debug", true)
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        data = d3wb.countCsvColumn(data, "category")
        d3wb.plotDonutChart(data, cv, {
            /* no attributes currently */
        });
    });

})()
