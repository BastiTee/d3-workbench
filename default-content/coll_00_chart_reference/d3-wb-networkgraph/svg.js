(function() {
    let cv = d3wb.config()
        .data('data.json')
        .toCanvas();

    d3.json(cv.data, function(error, data) {
        let chart = wbNetworkDiagram()
            .width(cv.wid)
            .height(cv.hei)
            .legend([
                ['type1', d3wb.color.category()[3]],
                ['type2', d3wb.color.category()[6]],
                ['type3', d3wb.color.category()[11]],
            ])
            .colors([
                d3wb.color.category()[3],
                d3wb.color.category()[6],
                d3wb.color.category()[11],
            ])
            .legendColor(d3wb.color.foreground);
        cv.datum(data).call(chart);

        cv.selectAll('.circles').call(
            d3wb.mouse.tooltip().selector(function(d) {
                let type = d.group == 0 ? 'type1' : d.group == 1 ?
                    'type2' : 'type3';
                return d.id + '\n' + type + '\nweight: ' +
                    d3.format('.3s')(d.weight);
            }));
    });
})();
