(function() {

    var cv = d3wb.initConfig()
        .attr("width", 1000)
        .attr("height", 500)
        .attr("margin", {
            top: 10,
            right: 50,
            bottom: 50,
            left: 50
        })
        .data("data.txt")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        data.forEach(function(d) {
            d.date = new Date(+d.date);
        });
        d3wb.plotTimeSeriesHistogram(data, cv, {
            target: "minute-of-day"
        });
    })

})()
