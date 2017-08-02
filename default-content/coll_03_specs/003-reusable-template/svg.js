var cv = d3wb.initConfig()
    .attr("width", 350)
    .attr("bgColor", d3wb.color.background)
    .data(["data1.csv", "data2.csv"])
    .initCanvas()
var chart = reusableChart().colors(d3wb.getOrdinalColors());

d3.queue()
    .defer(d3.csv, cv.config.data()[0])
    .defer(d3.csv, cv.config.data()[1])
    .await(function(error, data1, data2) {
        var pt = 0
        var data = [data1, data2]
        update(data, pt)
    });

var update = function(data, pt) {
    cv.svg.datum(data[pt]).call(chart);
    setInterval(function() {
        pt = (pt + 1) % 2
        cv.svg.datum(data[pt]).call(chart);
    }, 1000);

}