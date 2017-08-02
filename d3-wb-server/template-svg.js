(function() {

    var cv = d3wb.initConfig()
        .attr("width", 800)
        .attr("margin", {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        })
        .attr("debug", true)
        .data("data.csv")
        .initCanvas()

})()
