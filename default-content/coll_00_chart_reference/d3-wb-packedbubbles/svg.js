(function() {
    let cv = d3wb.config()
        .data('data.csv')
        .toCanvas();

    d3.csv(cv.data, function(error, data) {
        data.forEach(function(d) {
            d.value = +d.value;
            d.link = d.link.replace(/\/name\./, '/name,');
        });

        let chart = wbPackedBubbles()
            .width(cv.wid)
            .height(cv.hei)
            .fillRange([d3wb.color.blue, d3wb.color.blue.fade(10)])
            .colorRange([d3wb.color.foreground.fade(30), d3wb.color.foreground])
            .fadeOpacity([0.1, 1.0]);
        cv.datum(data).call(chart);

        let tt = d3wb.mouse.tooltip().selector(function(d) {
            return d.data.id + '\n' + d.data.value + ' births';
        });
        cv.selectAll('.circles').call(tt);
        cv.selectAll('.texts').call(tt);
    });
})();
