(function() {
    var cv = d3wb.initConfig().attr("margin", "40 40 50 60")
        .initCanvas()

    // create some data sets 
    var data = Array.apply(null, Array(1007)).map(function(curr, i) {
        return {
            "x": i,
            "y": Math.round(Math.random() * 1000)
        }
    })
    var dataSmooth = d3wb.util.smoothData(data, "x", "y", 10)
    var dataSmoothMore = d3wb.util.smoothData(data, "x", "y", 100)
    var sets = [data, dataSmooth, dataSmoothMore]
    var pt = 0

    // create a line plot
    var chart = wbLinePlot()
        .width(cv.wid)
        .height(cv.hei)
        .stroke(d3wb.color.red)
    cv.svg.datum(sets[pt]).call(chart)

    // create a button
    var button = wbButton()
        .labels(["Exact values", "Lightly smoothed", "Heavily smoothed"])
        .callback(function() {
            pt = (pt + 1) % sets.length
            chart.update(sets[pt])
        })
    cv.svg.call(button)

    // append a bunch of stuff
    cv.svg.call(d3wb.add.xAxis(chart.scaleX())
        .y(cv.hei).type(d3.axisBottom))
    cv.svg.call(d3wb.add.xAxisLabel("Label for the x axis")
        .orientation("bottom"))
    cv.svg.call(d3wb.add.yAxis(chart.scaleY()))
    cv.svg.call(d3wb.add.yAxisLabel("Label for the y axis"))
    cv.svg.call(d3wb.add.yAxisLabel("Label for another y axis")
        .orientation("right"))
    cv.svg.call(d3wb.add.title("Title of the chart"))
    cv.svg.call(d3wb.add.infoBox("This is a two-line\ninfo box. Yay!"))
    cv.svg.selectAll(".wb-button").call(d3wb.add.shadow())

})()