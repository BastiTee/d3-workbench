(function() {

    var cv = d3wb.initConfig()
        .attr("width", 800)
        .attr("height", 600)
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {
        var colors = d3wb.color.category()
        d3wb.plotNetworkGraph(data, cv, {
            tooltipSelector: function(d) {
                var type = d.group == 0 ? "type1" : d.group == 1 ?
                    "type2" : "type3"
                return d.id + "\n" + type + "\nweight: " +
                    d3.format(".3s")(d.weight)
            },
            groupColorScale: d3.scaleOrdinal(
                [colors[0], colors[3], colors[7]]
            ),
            legend: [
                ["type1", colors[0]],
                ["type2", colors[3]],
                ["type3", colors[7]]
            ]
        });
    })

})()
