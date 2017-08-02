(function() {
    "use strict";

    d3wb.tooltip = function(cv, attr) {

        var defaultAttr = {
            selector: function(d) {
                return d;
            },
            opacity: 0.9,
            padding: 5
        }
        attr = attr || defaultAttr
        attr.selector = attr.selector || defaultAttr.selector
        attr.opacity = attr.opacity || defaultAttr.opacity
        attr.padding = attr.padding || defaultAttr.padding

        var tt = {
            attr: attr,
            active: false
        }

        tt.mousemove = function() {
            var pos = d3.mouse(cv.canvas.node())
            var txtBox = tt.rect.node().getBBox()
            var newx = pos[0]
            var newy = pos[1] - txtBox.height
            // stop on borders
            newx = newx - (txtBox.width / 2) < 0 ? txtBox.width / 2 : newx
            newy = newy - tt.attr.padding < 0 ? tt.attr.padding : newy
            // move 
            tt.group.attr("transform", "translate(" +
                newx + "," + newy + ")")
        }

        tt.mouseout = function() {
            if (!tt.active) {
                return
            }
            tt.active = false
            tt.group.remove()
        }

        tt.mouseover = function(d) {
            if (tt.active) {
                return
            }
            tt.active = true
            // create a new tooltip element
            tt.group = cv.tooltips
                .append("g")
                .style("pointer-events", "none")
            tt.rect = tt.group.append("rect")
            tt.text = tt.group.append("text")
            // append tooltip text
            var string = "" + attr.selector(d)
            var split = string.split("\n")
            for (var i in split) {
                tt.text.append("tspan")
                    .style("text-anchor", "middle")
                    .style("alignment-baseline", "hanging")
                    .style("fill", d3wb.color.foreground)
                    .attr("x", 0)
                    .attr("dy", function() {
                        return i == 0 ? 0 : 20
                    })
                    .text(split[i])
            }
            // append background rectangle depending on text size
            var txtBox = tt.text.node().getBBox()
            tt.rect
                .attr("rx", "5").attr("ry", "5")
                .attr("width", txtBox.width + tt.attr.padding * 2)
                .attr("height", txtBox.height + tt.attr.padding * 2)
                .attr("x", -(txtBox.width / 2) - tt.attr.padding)
                .attr("y", -tt.attr.padding)
                .attr("opacity", attr.opacity)
                .style("fill", d3wb.color.background)
        }
        return tt
    }

})()