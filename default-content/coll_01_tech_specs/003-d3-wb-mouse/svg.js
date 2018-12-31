(function() {
    d3wb.theme('light');

    let cv = d3wb.config()
        .data('data.csv')
        .toCanvas();

    d3.csv(cv.data).then(function(data) {
        let dim = cv.wid / 3;
        cv.selectAll('rect')
            .data(data).enter().append('rect')
            .attr('class', 'rectangles')
            .attr('width', dim * 1.5)
            .attr('height', dim)
            .attr('x', function(d, i) {
                return (dim / 2) * 1.5 * i;
            })
            .attr('y', function(d, i) {
                return (dim / 2) * i;
            })
            .attr('fill', function(d) {
                return d['value'];
            });

        // appends a tooltip
        let rectTooltip = d3wb.mouse.tooltip()
            .color('#FFFFFF')
            .fill('#000000')
            .opacity(0.7)
            .padding(10)
            .roundCorners(10)
            .selector(function(d) {
                return d['value'];
            });
        cv.selectAll('.rectangles').call(rectTooltip);

        // appends a click-event
        let rectDoubleClick = d3wb.mouse.click()
            .action('openTarget')
            .event('dblclick')
            .openTarget(function(d) {
                return 'https://www.google.de/search?q=' + d.value;
            });
        cv.selectAll('.rectangles').call(rectDoubleClick);
    });
})();
