(function() {
    let cv = d3wb.config()
        .attr('margin', '10 10 40 60')
        .data('data.csv')
        .toCanvas();

    d3.csv(cv.data, function(error, data) {
        let chart = wbBarChart()
            .width(cv.wid)
            .height(cv.hei)
            .xSelector('space')
            .ySelector('votes')
            .fill(d3wb.color.blue);
        cv.datum(data).call(chart);

        cv.call(
            d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground));
        cv.call(
            d3wb.add.xAxis(chart.scaleX())
            .y(cv.hei)
            .color(d3wb.color.foreground));
        cv.call(
            d3wb.add.xAxisLabel('Storage size')
            .color(d3wb.color.foreground)
            .orientation('bottom'));
        cv.call(
            d3wb.add.yAxisLabel('Number of users')
            .color(d3wb.color.foreground));
        cv.selectAll('.rects').call(wbCooltip()
            .selector(function(d) {
                return d['votes'] + ' users';
            }));
    });
})();
