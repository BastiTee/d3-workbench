(function() {

    var cv = d3wb.initConfig()
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        data.forEach(function(d) {
            d.value = +d.value;
            d.link = d.link.replace(/\/name\./, "/name,")
        });

        var chart = wbPackedBubbles()
            .width(cv.wid)
            .height(cv.hei)
            .fillRange([d3wb.color.blue, d3wb.color.blue.fade(10)])
            .colorRange([d3wb.color.foreground.fade(30), d3wb.color.foreground])
            .fadeOpacity([0.1, 1.0])
        cv.svg.datum(data).call(chart)

        var tt = wbCooltip().selector(function(d) {
            return d.data.id + "\n" + d.data.value + " births";
        })
        cv.svg.selectAll(".circles").call(tt)
        cv.svg.selectAll(".texts").call(tt)
        

    })

})()