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
            d["x"] = +d["Market value $m"]
            d["y"] = +d["Employees"]
            d["Country code"] = +d["Country code"]
        });
        // Remove outliers «Hon Hai precision» and «Wal-Mart»
        data = data.filter(function(d) {
            return d["Employees"] <= 1100000
        })

        console.log(data[0]);

        var plot = wbScatterPlot()
            .height(cv.hei)
            .width(cv.wid)
            .xAxisScale(d3.scaleLog())
            .zDataPoints("Country code")
            .colorLow(d3wb.color.blue)
            .colorHigh(d3wb.color.red)
            .axisColor(d3wb.color.foreground)

        cv.svg.datum(data).call(plot)

        cv.svg.selectAll("circle")
            .call(d3wb.tooltip, {
                selector: function(d) {
                    return d["Company"] + " (" + d["Country"] +
                        ")\n" + d["Market value $m"] + " M$\n"
                },
                root: cv
            })

        d3wb.appendXAxisLabel(cv, "Market value $m")
        d3wb.appendRotatedYAxisLabel(cv, "Employees")

    });


}())