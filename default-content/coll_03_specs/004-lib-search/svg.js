(function() {

    var cv = d3wb.initConfig().data(["data.csv"]).initCanvas()
    var colors = d3wb.color.category()

    d3.queue()
        .defer(d3.csv, cv.config.data()[0])
        .await(function(error, data) {

            // create some elements 
            createRandomRects(data)
            // create a callback to decide what to do
            // with the text content 
            var callback = function(text) {
                d3.selectAll(".rects")
                    .attr("stroke", function(d) {
                        if (d["food"] == text) {
                            return "red"
                        } else {
                            return "none"
                        }
                    })
                    .attr("fill", function(d, i) {
                        if (d["food"] == text) {
                            return "red"
                        } else {
                            return colors[i * 4]
                        }
                    })
            }

            var t = wbTextbox().callback(callback)
            cv.svg.call(t)
            
            // add a hint how to use it
            var box = d3wb.add.infoBox(
`Hover rectangles to see solutions.
Use search box to search animals by food.`)
            cv.svg.call(box)
            
            // add solutions as tooltips
            var tooltip = wbCooltip().selector(function(d) {
                return d["food"]
            })
            cv.svg.selectAll(".boxes").call(tooltip)

        })

    var createRandomRects = function(data) {
        var rectSize = 50
        var boxes = cv.svg.selectAll(".boxes")
            .data(data).enter()
            .append("g")
            .attr("class", "boxes")
            .attr("transform", function() {
                var x = Math.random() * cv.wid - rectSize
                x = x > 0 ? x : 0
                var y = Math.random() * cv.hei - rectSize
                y = y > 0 ? y : 0
                return "translate(" + x + "," + y + ")"
            })

        cv.svg.selectAll(".boxes")
            .append("rect")
            .attr("class", "rects")
            .attr("fill", function(d, i) {
                return colors[i * 4]
            })
            .attr("width", rectSize).attr("height", rectSize)

        cv.svg.selectAll(".boxes")
            .append("text")
            .attr("class", "texts")
            .text(function(d) {
                return d["animal"]
            })
            .attr("fill", "white")
            .attr("alignment-baseline", "hanging")
    }
})()