(function() {
    const cv = d3wb.config()
        .attr('margin', '10 10 50 60')
        .data('data.txt')
        .toCanvas();

    d3.csv(cv.data, function(error, data) {
        data.forEach(function(d) {
            d.date = new Date(+d.date);
        });

        let chart = wbTimeseries()
            .width(cv.wid)
            .height(cv.hei)
            .fill(d3wb.color.blue)
            .fillAxis(d3wb.color.foreground)
            .target('minute-of-day');

        cv.datum(data).call(chart);
        cv.selectAll('.rects').call(d3wb.mouse.tooltip().selector(function(d) {
            return d.length + ' occurrences';
        }));
        cv.call(d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground));
        cv.call(d3wb.add.xAxisLabel('Minute')
            .color(d3wb.color.foreground).orientation('bottom'));
        cv.call(d3wb.add.yAxisLabel('Count')
            .color(d3wb.color.foreground));
    });
})();
