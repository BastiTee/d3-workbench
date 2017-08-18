(function() {

    var cv = d3wb.initConfig()
        .attr("margin.right", 100)
        .attr("margin.bottom", 10)
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        data = d3wb.util.countCsvColumn(data, "category")
        
        var chart = wbDonutChart()
            .width(cv.wid)
            .height(cv.hei)
            .colors(d3wb.color.ordinal())
            .fillLegend(d3wb.color.foreground)
        cv.svg.datum(data).call(chart)
        cv.svg.selectAll(".paths").call(wbCooltip().selector(function(d) {
            return d.data.label + "\nTotal: " + d.data.count +
                "\nProzent: " + d3.format(",.2f")(d.data.percent)
        }))
    });

})()