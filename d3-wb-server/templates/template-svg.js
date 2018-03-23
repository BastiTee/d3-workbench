(function() {
    let cv = d3wb.config()
        .attr('margin', '50 50 50 50')
        .attr('debug', true) // draw debug canvas
        .data(['data.csv']) // returns config object
        .toCanvas(); // converts config object to canvas object

    // load-pattern for multiple datasets
    Promise.all([
        d3.csv(cv.data[0]),
        // ...
    ]).then(function(values) {
        let data = values[0];
        // do something with the data..
        cv.selectAll('text')
            .data(data).enter().append('text')
            .text(function(d) {
                return d['id'] + ' != ' + d['value'];
            })
            .attr('text-anchor', 'middle')
            .attr('x', cv.wid / 2)
            .attr('y', cv.margin.top + 10)
            .attr('fill', d3wb.color.white);
    });
})();
