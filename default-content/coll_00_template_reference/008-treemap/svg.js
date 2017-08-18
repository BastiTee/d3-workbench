(function() {

    var cv = d3wb.initConfig()
        .attr("margin", {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        })
        .data("data.json")
        .initCanvas()

    d3.json(cv.config.data(), function(error, data) {
        treemap = d3wb.plotTreeMap(data, cv, {
            unit: "entries"
        });
    });

})()
