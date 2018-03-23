(function() {
    // d3wb.setGermanLocale()
    let cv = d3wb.config()
        .attr('margin', '10 50 60 80')
        .data('data.csv')
        .toCanvas();

    d3.csv(cv.data).then(function(data) {
        data.forEach(function(d) {
            d['x'] = +d['Market value $m'];
            d['y'] = +d['Employees'];
            d['Country code'] = +d['Country code'];
        });
        // Remove outliers «Hon Hai precision» and «Wal-Mart»
        data = data.filter(function(d) {
            return d['Employees'] <= 1100000;
        });

        let plot = wbScatterPlot()
            .height(cv.hei)
            .width(cv.wid)
            .xAxisScale(d3.scaleLog())
            .zDataPoints('Country code')
            .colorLow(d3wb.color.blue)
            .colorHigh(d3wb.color.red);

        cv.datum(data).call(plot);

        cv.selectAll('rect')
            .call(d3wb.mouse.tooltip().selector(function(d) {
                return d['Company'] + ' (' + d['Country'] +
                    ')\n' + d['Market value $m'] + ' M$\n';
            }));

        cv.call(d3wb.add.xAxisLabel('Market value $m')
            .color(d3wb.color.foreground)
            .orientation('bottom'));
        cv.call(d3wb.add.yAxisLabel('Employees')
            .color(d3wb.color.foreground));

        cv.call(d3wb.add.xAxisBottom(plot.xAxisScale())
            .y(cv.hei)
            .tickFormat(d3.format('.2s')));
        cv.call(d3wb.add.yAxis(plot.yAxisScale())
            .tickFormat(d3.format('.2s')));
    });
}());
