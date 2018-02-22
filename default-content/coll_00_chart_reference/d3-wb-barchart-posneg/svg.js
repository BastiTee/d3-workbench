(function() {
    let cv = d3wb.config().attr('margin', '5 5 5 50').toCanvas()

    let convertToCsv = function(dataset) {
        let csvRaw = ['cat,amount']
        for (let key in dataset) {
            let line = key + ',' + dataset[key]
            csvRaw.push(line)
        }
        let csvString = csvRaw.join('\n');
        let csvData = d3.csvParse(csvString);
        csvData.forEach(function(d) {
            d['amount'] = +d['amount']
        })
        return csvData.sort(function(a, b) {
            return b['amount'] - a['amount']
        })
    }

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let data = {}
    for (let i = 0; i < 10; i++) {
        data['category-' + i] = randomIntFromInterval(-100, 100)
    }
    data = convertToCsv(data);

    let chart = wbBarChartPosNeg()
        .width(cv.wid)
        .height(cv.hei)
        .xSelector('cat')
        .ySelector('amount')
        .sortDirection('desc')
        .fillPos(d3wb.color.green)
        .fillNeg(d3wb.color.red);
    cv.datum(data).call(chart);

    cv.call(
        d3wb.add.yAxis(chart.scaleY())
        .color(d3wb.color.foreground));
    cv.call(
        d3wb.add.yAxisLabel('Value')
        .color(d3wb.color.foreground));
    cv.call(
        d3wb.add.xAxis(chart.scaleX())
        .y(chart.scaleY()(0))
        .type(d3.axisBottom)
        .rotation(90)
        .color(d3wb.color.foreground));
    let tooltip = d3wb.mouse.tooltip()
        .selector(function(d) {
            return d['cat'] + '\n' + d['amount']
        })
    cv.selectAll('.rects').call(tooltip);


})();
