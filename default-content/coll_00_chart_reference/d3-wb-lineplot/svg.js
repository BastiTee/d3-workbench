(function() {
    let cv = d3wb.config().attr('margin', '10 100 50 50')
        .data('data.csv')
        .toCanvas();
    d3wb.util.setLocale('de');

    d3.csv(cv.data, function(error, data) {
        // prepare data
        let parseTime = d3.timeParse('%Y-%m-%d');
        data.forEach(function(d) {
            d.date = parseTime(d.date);
            d.close = +d.close;
        });
        let dataSmooth = d3wb.util.smoothData(data, 'date', 'close', 30);
        data.forEach(function(d, i) {
            d.closeSmooth = dataSmooth[i].close;
        });

        // create first lineplot
        let chart = wbLinePlot()
            .width(cv.wid)
            .height(cv.hei)
            .stroke([d3wb.color.blue, d3wb.color.black])
            .xAxisScale(d3.scaleTime())
            .xDataPoints('date')
            .yDataPoints(['close', 'closeSmooth'])
            .curve([d3.curveBasis, d3.curveBasis])
            .legendX(cv.wid + cv.mar.right - 5)
            .activateTooltip(true);
        cv.append('g').datum(data).call(chart);

        // add axis and controls
        cv.call(d3wb.add.xAxisBottom(chart.scaleX())
            .y(cv.hei)
            .color(d3wb.color.foreground));
        cv.call(d3wb.add.yAxis(chart.scaleY())
            .color(d3wb.color.foreground));
        cv.call(d3wb.add.xAxisLabel('Datum')
            .color(d3wb.color.foreground)
            .orientation('bottom'));
        cv.call(d3wb.add.yAxisLabel('Wert')
            .color(d3wb.color.foreground));
    });
}());
