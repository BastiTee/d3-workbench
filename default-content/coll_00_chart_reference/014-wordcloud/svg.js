(function() {

    var cv = d3wb.config()
        .data("data.csv")
        .toCanvas()

    d3.csv(cv.data, function(error, data) {

        var chart = wbWordCloud()
            .width(cv.wid)
            .height(cv.hei)
            .colorRange([d3wb.color.black, d3wb.color.blue])
        cv.datum(data).call(chart)

    });

})()