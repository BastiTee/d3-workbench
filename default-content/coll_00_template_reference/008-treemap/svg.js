(function() {

    var cv = d3wb.config().attr("margin", "10 10 10 10")
        .data("data.json")
        .toCanvas()

    d3.json(cv.data, function(error, data) {

        var chart = wbTreeMap()
            .width(cv.wid)
            .height(cv.hei)
            .colors(d3wb.color.ordinal())
            .fill(d3wb.color.foreground)
        cv.datum(data).call(chart)

        cv.selectAll(".cells")
            .call(wbCooltip().selector(function(d) {
                return d.data.id + "\n" + d.value;
            }))
    });

})()