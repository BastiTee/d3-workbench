function wbPackedBubbles() {
    "use strict";

    var width = 500
    var height = 500
    var colorRange = ["green", "white"]
    var fillRange = ["green", "red" ]
    var fadeOpacity
    
    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)

            var minMax = d3.extent(data, function(d) {
                return d.value
            })
            
            var fgColors = d3.scaleLinear().domain(minMax)
                .interpolate(d3.interpolate)
                .range(colorRange);
            var bgColors = d3.scaleLinear().domain(minMax)
            .interpolate(d3.interpolate)
            .range(fillRange);
            
            if (fadeOpacity) {
                var opScale = d3.scaleLog().domain(minMax)
                    .range(fadeOpacity);
            }

            var pack = d3.pack()
                .size([width, height])
                .padding(0.3);

            var root = d3.hierarchy({
                    children: data
                })
                .sum(function(d) {
                    return d.value;
                })

            var nodes = s.selectAll("node")
                .data(pack(root).leaves())
                .enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });


            nodes
                .append("a").attr("xlink:href", function(d) {
                    return d.data.link
                })
                .append("circle")
                .attr("class", "circles")
                .attr("id", function(d) {
                    return d.id;
                })
                .transition().duration(500)
                .attr("r", function(d) {
                    return d.r;
                })
                .style("fill", function(d) {
                    return bgColors(d.value)
                })
                .style("opacity", function(d) {
                    if (fadeOpacity) {
                        return opScale(d.value)
                    }
                    return "1.0";
                })            

            nodes
                .append("a").attr("xlink:href", function(d) {
                    return d.data.link
                })
                .append("text")
                .attr("class", "texts")
                .style("font-size", "10px")
                .style("text-anchor", "middle")
                .style("dominant-baseline", "middle")
                .attr("x", 0)
                .attr("y", 0)
                .text(function(d) {
                    return d.data.id
                })
                .style("font-size", function(d) {
                    return ((2 * d.r - 10) / this.getComputedTextLength() * 10) + "px";
                })
                .style("opacity", function(d) {
                    if (fadeOpacity) {
                        return opScale(d.value)
                    }
                    return "1.0";
                })
                .transition().duration(1000)
                .style("fill", function(d) {
                    return fgColors(d.value)
                })
                
        })
    }

    chart.width = function(value) {
        if (!arguments.length) return width
        width = value;
        return chart;
    }

    chart.height = function(value) {
        if (!arguments.length) return height
        height = value;
        return chart;
    }
    
    chart.colorRange = function(value) {
        if (!arguments.length) return colorRange
        colorRange = value;
        return chart;
    }
    
    chart.fillRange = function(value) {
        if (!arguments.length) return fillRange
        fillRange = value;
        return chart;
    }

    chart.fadeOpacity = function(value) {
        if (!arguments.length) return fadeOpacity
        fadeOpacity = value;
        return chart;
    }

    return chart
}
