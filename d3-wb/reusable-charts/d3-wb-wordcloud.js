(function() {
    "use strict";

    d3wb.plotWordCloud = function(data, cv, attr) {

        data.forEach(function(d) {
            d.fontsize = +d.textrank * 10000
        });
        var minMax = d3.extent(data, function(d) {
            return d.textrank
        })
        var fgColors = d3wb.color.linearGradient(minMax, [cv.config.bgColor, d3wb.color.foreground])

        d3.layout.cloud().size([cv.wid, cv.hei])
            .words(data)
            .padding(1)
            .rotate(0)
            .font("Abel")
            .fontSize(function(d) {
                return d.fontsize;
            })
            .on("end", function(data) {
                cv.svg.attr("transform", "translate(" +
                    (cv.wid / 2 + cv.mar.left) + "," +
                    (cv.hei / 2 + cv.mar.top) + ")");

                var cloud = cv.svg.selectAll("text")
                    .data(data, function(d) {
                        return d.text;
                    })

                cloud.enter()
                    .append("text")
                    .style("fill", function(d) {
                        return fgColors(d.textrank);
                    })
                    .attr("text-anchor", "middle")
                    .attr('font-size', function(d) {
                        return d.size + "px";
                    })
                    .attr("transform", function(d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    })
                    .text(function(d) {
                        return d.text;
                    });

                cloud.exit().remove();

            }).start();
    }
})()
