(function() {

    var cv = d3wb.initConfig()
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {

        var chart = wbWordCloud()
            .width(cv.wid)
            .height(cv.hei)
            .colorRange([d3wb.color.black, d3wb.color.blue])
        cv.svg.datum(data).call(chart)

    });

})()