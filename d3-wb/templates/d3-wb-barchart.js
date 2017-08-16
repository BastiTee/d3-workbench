(function() {
    "use strict";

    d3wb.plotBarChart = function(data, cv, attr) {
        data.forEach(function(d) {
            d[attr.ySelector] = +d[attr.ySelector]
        })

        var x = d3
            .scaleBand()
            .rangeRound([0, cv.wid], .1)
            .paddingInner(0.1)
            .domain(data.map(function(d) {
                return d[attr.xSelector]
            }))

        var y = d3.scaleLinear()
            .range([cv.hei, 0])
            .domain([0, d3.max(data, function(d) {
                return d[attr.ySelector];
            })])

        cv.svg.selectAll("rect")
            .data(data)
            .enter().append("rect")
            .attr("x", function(d) {
                return x(d[attr.xSelector]);
            })
            .attr("width", x.bandwidth())
            .attr("y", function(d) {
                return y(d[attr.ySelector]);
            })
            .attr("height", function(d) {
                return cv.hei - y(d[attr.ySelector]);
            })
            .attr("fill", d3wb.color.blue)
            .call(wbCooltip().selector(function(d) {
                return d[attr.xSelector] + "\n" + d[attr.ySelector] + " " +
                    attr.yLabel
            }))

        cv.svg.call(d3wb.add.yAxis(y).color(d3wb.color.foreground))
        cv.svg.call(d3wb.add.xAxis(x).y(cv.hei).color(d3wb.color.foreground))
        cv.svg.call(d3wb.add.xAxisLabel(attr.xLabel).color(d3wb.color.foreground).orientation("bottom"))
        cv.svg.call(d3wb.add.yAxisLabel(attr.yLabel).color(d3wb.color.foreground))

    }

    d3wb.plotStackedBarChart = function(data, cv, attr) {

        d3wb.util.injectCSS(`
            .axis line{
              stroke: ` + d3wb.color.foreground + `;
            }
            .axis path{
              stroke: ` + d3wb.color.foreground + `;
            }
            .axis text{
              fill: ` + d3wb.color.foreground + `;
            }  
            `)

        data.forEach(function(d, i) {
            var keys = Object.keys(d)
            d.total = 0
            for (i = 1; i < keys.length; ++i) {
                d.total += d[keys[i]] = +d[keys[i]];
            }
        })

        var x = d3.scaleBand()
            .rangeRound([0, cv.wid])
            .paddingInner(0.05)
            .align(0.1);

        var y = d3.scaleLinear()
            .rangeRound([cv.hei, 0]);

        var z = d3.scaleOrdinal()
            .range(attr.colors);

        var keys = data.columns.slice(1);

        data.sort(function(a, b) {
            return b.total - a.total;
        });
        x.domain(data.map(function(d) {
            return d.id;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.total;
        })]).nice();
        z.domain(keys);

        cv.svg.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function(d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function(d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function(d) {
                return x(d.data.id);
            })
            .attr("y", function(d) {
                return y(d[1]);
            })
            .attr("height", function(d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("width", x.bandwidth())
            .call(wbCooltip().selector(function(d) {
                var infos = [d.data.id]
                for (var key in keys) {
                    infos.push(keys[key] + ": " + d.data[keys[key]])
                }
                infos.push("total: " + d.data.total)
                return infos.join('\n')
            }))

        cv.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + cv.hei + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", -2)
            .attr("x", -9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .style("font-size", "130%")

        cv.svg.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))

        var legend = cv.svg.append("g")
            .attr("font-size", "75%")
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice())
            .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", cv.wid - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", cv.wid - 24)
            .attr("y", 9.5)
            .attr("fill", d3wb.color.foreground)
            .attr("dy", "0.32em")
            .text(function(d) {
                return d;
            });
    };
})()