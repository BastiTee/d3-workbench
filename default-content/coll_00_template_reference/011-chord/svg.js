(function() {

    var cv = d3wb.initConfig()
        .data(["matrix.json", "keys.csv"])
        .initCanvas()

    d3.queue()
        .defer(d3.json, cv.config.data()[0])
        .defer(d3.csv, cv.config.data()[1])
        .await(function(error, matrix, keys) {
            d3wb.plotChordDiagram(matrix, keys, cv, {
                leftSideColumn: "left",
                rightSideColumn: "right",
                countColumn: "count"
            })
        })
})()
