(function() {

    // d3wb.setGermanLocale()
    var cv = d3wb.initConfig()
        .attr("width", 1000)
        .attr("height", 500)
        .attr("margin", {
            top: 10,
            right: 50,
            bottom: 50,
            left: 80
        })
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        if (error) throw error;
        data.forEach(function(d) {
            d["Market value $m"] = +d["Market value $m"]
            d["Employees"] = +d["Employees"]
        });
        // Remove outliers «Hon Hai precision» and «Wal-Mart»
        data = data.filter(function(d) {
            return d["Employees"] <= 1100000
        })
        d3wb.plotScatterPlot(data, cv, {
            xAxisScale: d3.scaleLog(),
            yAxisScale: d3.scaleLinear(),
            xDataPoints: "Market value $m",
            xLabel: "Market value $m",
            yDataPoints: "Employees",
            yLabel: "Employees",
            colorSelector: "Country code",
            tooltipSelector: function(d) {
                return d["Company"] + " (" + d["Country"] +
                    ")\n" + d["Market value $m"] + " M$\n"
            }
        });
    });


}())
