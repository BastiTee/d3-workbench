(function() {

    var cv = d3wb.config().attr("margin", "10 10 50 70")
        .data("data.csv")
        .toCanvas()

    d3.csv(cv.data, function(error, data) {

        data.forEach(function(d) {
            d.value = +d.value
        });

        cv.call(d3wb.add.xAxisLabel("Video rating").orientation("bottom")
            .color(d3wb.color.foreground))
        cv.call(d3wb.add.yAxisLabel("Number of videos")
            .color(d3wb.color.foreground))

        var chart = wbNumericHistogram()
            .height(cv.hei)
            .width(cv.wid)
            .barColor(d3wb.color.blue)
            .axisColor(d3wb.color.foreground)
        cv.datum(data).call(chart);

        cv.call(d3wb.add.infoBox(
                "Click to select area\nDouble-click for reset")
            .color(d3wb.color.background)
            .fill(d3wb.color.foreground))
        
    })


})()