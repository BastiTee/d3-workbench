(function() {

    var cv = d3wb.initConfig()
        .data(["matrix.json", "keys.csv"])
        .initCanvas()

    d3.queue()
        .defer(d3.json, cv.config.data()[0])
        .defer(d3.csv, cv.config.data()[1])
        .await(function(error, matrix, keys) {

            var chart = wbChordDiagram()
                .width(cv.wid)
                .height(cv.hei)
                .matrix(matrix)
                .keys(keys)
                .colors(d3wb.color.ordinal())
                .color(d3wb.color.foreground)
            cv.svg.call(chart)

            d3wb.util.injectCSS(
                ".chord-circle:hover path.fade { display: none;}")
            cv.svg.selectAll(".chordpaths").call(
                wbCooltip().selector(function(d) {
                return keys[d.source.index].key + " w/ " +
                    keys[d.source.subindex].key + "\n" +
                    d.source.value
            }))
        })
})()