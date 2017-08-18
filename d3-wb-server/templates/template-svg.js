(function() {

    var cv = d3wb.initConfig()
        .attr("margin", "50 50 50 50")
        .attr("debug", true) // draw debug canvas 
        .data(["data.csv"]) // returns config object
        .initCanvas() // converts config object to canvas object 

    d3.queue() // load-pattern for multiple datasets
        .defer(d3.csv, cv.config.data()[0])
        .await(function(error, data) {

            // do something with the data.. 
            cv.svg.selectAll("text")
                .data(data).enter().append("text")
                .text(function(d) {
                    return d["id"] + " != " + d["value"]
                })
                .attr("text-anchor", "middle")
                .attr("x", cv.wid / 2)
                .attr("y", cv.margin.top + 10)
                .attr("fill", d3wb.color.white)

        })
})()
