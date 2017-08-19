(function() {

    var cv = d3wb.initConfig().attr("margin", "10 10 50 50")
        .data("data.csv")
        .locale("de")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {

        // prepare data
        var parseTime = d3.timeParse("%Y-%m-%d");
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
        })

        // create first lineplot 
        var chart = wbLinePlot()
            .width(cv.wid)
            .height(cv.hei)
            .stroke(d3wb.color.blue)
            .xAxisScale(d3.scaleTime())
            .xDataPoints("date")
            .yDataPoints("close")
        cv.svg.append("g").datum(data).call(chart)

        // smooth data set 
        var dataSmooth = d3wb.util.smoothData(data, "date", "close", 30)

        // create another plot on top
        var chart2 = wbLinePlot()
            .width(cv.wid)
            .height(cv.hei)
            .stroke(d3wb.color.foreground)
            .xAxisScale(d3.scaleTime())
            .xDataPoints("date")
            .yDataPoints("close")
        cv.svg.append("g").datum(dataSmooth).call(chart2)

        // add axis and controls 
        cv.svg.call(d3wb.add.xAxisBottom(chart.scaleX())
            .y(cv.hei)
            .color(d3wb.color.foreground))
        cv.svg.call(d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground))
        cv.svg.call(d3wb.add.xAxisLabel("Datum")
            .color(d3wb.color.foreground)
            .orientation("bottom"))
        cv.svg.call(d3wb.add.yAxisLabel("Wert")
            .color(d3wb.color.foreground))

    });

}())