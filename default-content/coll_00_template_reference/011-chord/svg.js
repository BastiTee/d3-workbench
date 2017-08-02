(function() {

    var cv = d3wb.initConfig()
        .attr("width", 800)
        .attr("height", 800)
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        d3wb.plotChordDiagram(data, cv, {
            leftSideColumn: "left",
            rightSideColumn: "right",
            countColumn: "count"
        });
    });

})()
