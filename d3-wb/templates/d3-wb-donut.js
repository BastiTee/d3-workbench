(function() {
    "use strict";

    d3wb.plotDonutChart = function(data, cv) {

        var pie = d3.pie()
            .value(function(d) {
                return d.percent
            })
            .sort(null)
            .padAngle(.03);

        var outerRadius = Math.min(cv.wid, cv.hei) / 2;
        var innerRadius = Math.min(cv.wid, cv.hei) / 8;

        var color = d3wb.getOrdinalColors()

        cv.svg.attr("transform", "translate(" +
            (cv.wid / 2 + cv.mar.left) + "," +
            (cv.hei / 2 + cv.mar.top) + ")");

        var arc = d3.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius)

        var tt = d3wb.tooltip(cv, {
            selector: function(d) {
                return d.data.label + "\nTotal: " + d.data.count +
                    "\nProzent: " + d3.format(",.2f")(d.data.percent)
            }
        })

        var path = cv.svg.selectAll("path")
            .data(pie(data))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", function(d, i) {
                return color(d.data.label);
            })
            .on("mouseover", tt.mouseover)
            .on("mousemove", tt.mousemove)
            .on("mouseout", tt.mouseout)

        var ordinal = d3.scaleOrdinal()
            .domain(data.map(function(d) {
                return d.label;
            }))
            .range(data.map(function(d) {
                return color(d.label);
            }));

        cv.svg.append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(" + (outerRadius + 10) + "," +
                    (-outerRadius + 10) + ")";
            });
        var legend = d3.legendColor()
            .shape("path", d3.symbol().type(d3.symbolCircle).size(100)())
            .scale(ordinal);
        cv.svg.select(".legend")
            .call(legend)
            .style("fill", d3wb.color.foreground)
            .style("font-size", "90%")

    };
})()