(function() {
    let cv = d3wb.config()
        .data(['matrix.json', 'keys.csv'])
        .toCanvas();

    Promise.all([
        d3.json(cv.data[0]),
        d3.csv(cv.data[1])
    ]).then(function(values) {
        let matrix = values[0];
        let keys = values[1];
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
            d3wb.mouse.tooltip().selector(function(d) {
                return keys[d.source.index].key + ' w/ ' +
                    keys[d.source.subindex].key + '\n' +
                    d.source.value;
            }));
    });
})();
