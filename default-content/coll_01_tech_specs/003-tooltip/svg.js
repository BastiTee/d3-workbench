(function() {

    var cv = d3wb.config()
        .data("data.csv")
        .toCanvas()

    d3.csv(cv.data, function(error, data) {
        var dim = cv.wid / 3
        cv.selectAll("rect")
            .data(data).enter().append("rect")
            .attr("class", "rectangles")
            .attr("width", dim * 1.5)
            .attr("height", dim)
            .attr("x", function(d, i) {
                return (dim / 2) * 1.5 * i
            })
            .attr("y", function(d, i) {
                return (dim / 2) * i
            })
            .attr("fill", function(d) {
                return d["value"]
            })

        var tt = cv.append("g")
        var rectTooltip = wbCooltip()
            .color(d3wb.color.background)
            .fill(d3wb.color.foreground)
            .opacity(0.7)
            .padding(10)
            .roundCorners(10)
            .selector(function(d) {
                return d["value"]
            })
        cv.selectAll(".rectangles").call(rectTooltip)
        
    })
})()