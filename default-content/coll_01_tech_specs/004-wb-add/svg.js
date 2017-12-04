(function() {
    var cv = d3wb.config().attr("margin", "40 40 50 60")
        .toCanvas()

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
        .legendX(cv.wid + cv.mar.right - 5)
    cv.datum(sets[pt]).call(chart)

    // create a button
    var button = d3wb.html.button()
        .options(["Lightly smoothed", "Heavily smoothed", "Exact values"])
        .style("top", cv.mar.top + "px")
        .style("left", (cv.mar.left + 2) + "px")
        .callback(function() {
            pt = (pt + 1) % sets.length
            chart.update(sets[pt])
        })
    cv.div.call(button)

    // append a bunch of stuff
    cv.call(d3wb.add.xAxis(chart.scaleX())
        .y(cv.hei).type(d3.axisBottom))
    cv.call(d3wb.add.xAxisLabel("Label for the x axis")
        .orientation("bottom"))
    cv.call(d3wb.add.yAxis(chart.scaleY()))
    cv.call(d3wb.add.yAxisLabel("Label for the y axis"))
    cv.call(d3wb.add.yAxisLabel("Label for another y axis")
        .orientation("right"))
    cv.call(d3wb.add.title("Title of the chart"))
    cv.selectAll(".wb-button").call(d3wb.add.shadow())

})()