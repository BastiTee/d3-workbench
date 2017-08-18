(function() {

    var cv = d3wb.initConfig()
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {

        var chart = wbWordcloud()
            .width(cv.wid)
            .height(cv.hei)
        cv.svg.datum(data).call(chart)

    });

})()