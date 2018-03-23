(function() {
    let cv = d3wb.config()
        .attr('margin.right', 100)
        .attr('margin.bottom', 10)
        .data('data.csv')
        .toCanvas();

    d3.csv(cv.data).then(function(data) {
        data = d3wb.util.countCsvColumn(data, 'category');

        let chart = wbDonutChart()
            .radius(Math.min(cv.wid, cv.hei))
            .colors(d3wb.color.ordinal())
            .fillLegend(d3wb.color.foreground);
        cv.datum(data).call(chart);

        cv.transformCircular();
        cv.selectAll('.paths').call(
            d3wb.mouse.tooltip().selector(
                function(d) {
                    return d.data.label + '\nTotal: ' + d.data.count +
                        '\nProzent: ' + d3.format(',.2f')(d.data.percent);
                }));
    });
})();
