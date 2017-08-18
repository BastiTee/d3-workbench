(function() {
    var cv = d3wb.initConfig()
        .attr("margin", {
            top: 10,
            right: 80,
            bottom: 50,
            left: 50
        })
        .data("data.csv")
        .locale("de")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        const parseDate = d3.timeParse("%Y-%m-%d");
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value
        });
        d3wb.plotTimeSeriesHistogram(
            data, cv, {
                target: "weekday",
                colorPalette: ["#323031", "#DB3A34"],
                valueColumn: true,
                xLabel: "Wochentag",
                yLabel: "Anzahl",
                yLabel2: "Gewicht"
            });
    });
}())
