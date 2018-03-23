(function() {
    let cv = d3wb.config()
        .attr('margin', '10 90 50 60')
        .data('data.csv')
        .toCanvas();

    d3.csv(cv.data).then(function(data) {
        const parseDate = d3.timeParse('%Y-%m-%d');
        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.value = +d.value;
        });


        let chart = wbTimeseries()
            .width(cv.wid)
            .height(cv.hei)
            .fill(d3wb.color.blue)
            .fillValues(d3wb.color.cyan)
            .fillAxis(d3wb.color.foreground)
            .target('weekday')
            .valueColumn('value');

        cv.datum(data).call(chart);

        cv.selectAll('.rects').call(d3wb.mouse.tooltip().selector(function(d) {
            return d.length + ' occurrences';
        }));
        cv.selectAll('.valuerects').call(d3wb.mouse.tooltip().selector(function(d) {
            return d3.formatPrefix('.1', 1e6)(d.mean) + ' average';
        }));

        cv.call(d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground));
        cv.call(d3wb.add.xAxisLabel('Weekday')
            .color(d3wb.color.foreground).orientation('bottom'));
        cv.call(d3wb.add.yAxisLabel('Count')
            .color(d3wb.color.foreground));
        cv.call(d3wb.add.yAxisRight(chart.scaleY2())
            .x(cv.wid).color(d3wb.color.foreground));
        cv.call(d3wb.add.yAxisLabel('Other count')
            .orientation('right').color(d3wb.color.foreground));
    });
}());
