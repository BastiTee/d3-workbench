(function() {
    // d3wb.setGermanLocale()
    var cv = d3wb.initConfig()
        .attr("margin", {
            top: 10,
            right: 10,
            bottom: 30,
            left: 30
        })
        .data("data.csv")
        // .locale("de")
        .initCanvas()
    d3wb.util.setLocale("de")

    d3.csv(cv.config.data(), function(error, data) {

        // prepare data
        var parseTime = d3.timeParse("%Y-%m-%d");
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
        })

        // create X axis
        var x = d3.scaleTime().rangeRound([0, cv.wid]).domain(
            d3.extent(data, function(d) {
                return d.date;
            }));

        // create Y axis
        var y = d3.scaleLinear().rangeRound([cv.hei, 0]).domain(
            d3.extent(data, function(d) {
                return d.close;
            }));

        // create a high resolution line
        d3wb.plotLine(cv, data, {
            xAxis: x,
            yAxis: y,
            xDataPoints: "date",
            yDataPoints: "close",
            smoothing: true,
            addAxis: true
        })

        // create an averaged data set
        var data = d3wb.util.reduceData(data, "date", "close", 100)

        // create a low resolution line
        d3wb.plotLine(cv, data, {
            xAxis: x,
            yAxis: y,
            xDataPoints: "date",
            yDataPoints: "close",
            smoothing: true,
            addAxis: false
        })

    });

}())
