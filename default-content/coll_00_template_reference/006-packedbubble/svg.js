(function() {

    var cv = d3wb.initConfig()
        .data("data.csv")
        .initCanvas()

    d3.csv(cv.config.data(), function(error, data) {
        data.forEach(function(d) {
            d.value = +d.value;
            d.link = d.link.replace(/\/name\./, "/name,")
        });
        d3wb.plotPackedBubbles(data, cv, {
            fadeOpacity: [0.1, 1.0],
            tooltipSelector: function(d) {
                return d.data.id + "\n" + d.data.value + " births";
            },
            transitionDuration: 900
        });
    });

})()
