(function() {
    let cv = d3wb.config()
        .data(['matrix.json', 'keys.csv'])
        .toCanvas();

    d3.queue()
        .defer(d3.json, cv.data[0])
        .defer(d3.csv, cv.data[1])
        .await(function(error, matrix, keys) {
            let chart = wbChordDiagram()
                .radius(cv.wid)
                .matrix(matrix)
                .keys(keys)
                .colors(d3wb.color.ordinal())
                .fill(d3wb.color.foreground);
            cv.call(chart);

            cv.transformCircular();

            d3wb.util.injectCSS(
                '.chord-circle:hover path.fade { display: none;}');
            cv.selectAll('.chordpaths').call(
                wbCooltip().selector(function(d) {
                    return keys[d.source.index].key + ' w/ ' +
                        keys[d.source.subindex].key + '\n' +
                        d.source.value;
                }));
        });
})();
