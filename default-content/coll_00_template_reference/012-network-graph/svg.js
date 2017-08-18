(function() {

    var cv = d3wb.initConfig()
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {

        var chart = wbNetwork()
            .width(cv.wid)
            .height(cv.hei)
            .legend([
                ["type1", d3wb.color.category()[0]],
                ["type2", d3wb.color.category()[1]],
                ["type3", d3wb.color.category()[2]]
            ])
            .colors(d3wb.color.ordinal())
            .fill(d3wb.color.foreground)
        cv.svg.datum(data).call(chart)
        cv.svg.selectAll(".circles").call(
            wbCooltip().selector(function(d) {
                var type = d.group == 0 ? "type1" : d.group == 1 ?
                    "type2" : "type3"
                return d.id + "\n" + type + "\nweight: " +
                    d3.format(".3s")(d.weight)
            }))
    });

})()