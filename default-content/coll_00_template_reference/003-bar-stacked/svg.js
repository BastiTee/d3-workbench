(function() {

    var cv = d3wb.initConfig()
        .attr("margin", {
            top: 20,
            right: 5,
            bottom: 75,
            left: 30
        })
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        var col = d3wb.color.category()
        d3wb.plotStackedBarChart(data, cv, {
            colors: [col[0], col[3], col[7]]
        });
    })

})()
