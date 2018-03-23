(function() {

    var cv = d3wb.config()
        .attr('margin', '5 10 60 10')
        .data('data.csv')
        .toCanvas()

    d3.csv(cv.data).then(function(data) {

        let tt = d3wb.mouse.tooltip()
            .selector(function(d) {
                return 'Year: ' + d['label'] + '\n' +
                    'Expenses: ' + d['neg'] + ' $\n' +
                    'Incomes: ' + d['pos'] + ' $'
            })

        let posNeg = wbPosNeg()
            .width(cv.wid)
            .height(cv.hei)
            .fillPos(d3wb.color.green)
            .fillNeg(d3wb.color.red)
        cv.datum(data).call(posNeg);

        cv.selectAll('.rects-pos').call(tt)
        cv.selectAll('.rects-neg').call(tt)

        cv.call(d3wb.add.yAxis(posNeg.scaleY())
            .color(d3wb.color.foreground)
            .x(cv.wid / 2)
        )

        cv.call(d3wb.add.xAxis(posNeg.scaleX())
            .color(d3wb.color.foreground)
            .y(cv.hei)
            .x(cv.wid / 2)
            .type(d3.axisBottom)
            .ticks(5)
        )
        // flip version
        let scaleXFlip = d3.scaleLinear()
            .range(posNeg.scaleX().range())
            .domain(posNeg.scaleX().domain().reverse());

        cv.call(d3wb.add.xAxis(scaleXFlip)
            .color(d3wb.color.foreground)
            .y(cv.hei)
            .type(d3.axisBottom)
            .ticks(5)
        )

        cv.call(d3wb.add.xAxisLabel('Amount in $')
            .color(d3wb.color.foreground)
            .orientation('bottom')
        )

    })

})()
