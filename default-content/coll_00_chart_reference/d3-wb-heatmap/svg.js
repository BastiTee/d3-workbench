(function() {
    let cv = d3wb.config()
        .attr('margin', '25 5 80 80')
        .data('data.csv')
        .toCanvas();

    d3.csv(cv.data).then(function(data) {
        let start = d3wb.color.cyan.fade(50);
        let end = d3wb.color.red.fade(20);
        let colors = d3wb.color.gradientArray(start, end, 12);

        let chart = wbHeatMap()
            .width(cv.wid)
            .height(cv.hei)
            .colors(colors)
            .fill(d3wb.color.foreground);
        cv.datum(data).call(chart);

        cv.selectAll('.hour').call(
            d3wb.mouse.tooltip().selector(function(d) {
                return d.value;
            }));
    });
}());
