(function() {
    let cv = d3wb.config()
        .attr('margin', '20 5 75 50')
        .data('data.csv')
        .toCanvas();

    d3.csv(cv.data, function(error, data) {
        let col = d3wb.color.category();

        let chart = wbStackedBarChart()
            .width(cv.wid)
            .height(cv.hei)
            .legendFill(d3wb.color.foreground)
            .legendX(cv.wid)
            .colors([col[0], col[3], col[7]]);
        cv.datum(data).call(chart);

        cv.selectAll('.rects').call(wbCooltip().selector(function(d) {
            let infos = [d.data.id];

            infos.push('total: ' + d.data.total);
            return infos.join('\n');
        }));


        cv.call(
            d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground));
        cv.call(
            d3wb.add.xAxis(chart.scaleX())
            .y(cv.hei)
            .type(d3.axisBottom)
            .rotation(90)
            .color(d3wb.color.foreground));
        cv.call(
            d3wb.add.xAxisLabel('Storage size')
            .color(d3wb.color.foreground)
            .orientation('bottom'));
        cv.call(
            d3wb.add.yAxisLabel('Number of users')
            .color(d3wb.color.foreground));
    });
})();
