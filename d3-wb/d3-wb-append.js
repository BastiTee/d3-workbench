(function() {
    "use strict";

    var applyCss = function() {
        d3wb.injectCSS(`
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
    }

    d3wb.appendDropShadow = function(cv, id, config) {
        config = config || {
            "blur": 3,
            "xOffset": 2,
            "yOffset": 1,
            "opacity": 0.4
        }
        var defs = cv.svg.append('defs');
        var filter = defs.append('filter')
            .attr('id', id)
        filter.append('feGaussianBlur')
            .attr('in', 'SourceAlpha')
            .attr('stdDeviation', config.blur)
            .attr('result', 'blur')
        filter.append('feOffset')
            .attr('in', 'blur')
            .attr('dx', config.xOffset)
            .attr('dy', config.yOffset)
            .attr('result', 'offsetBlur');
        filter.append('feComponentTransfer')
            .append('feFuncA')
            .attr('type', 'linear')
            .attr("slope", config.opacity)

        var feMerge = filter.append('feMerge');
        feMerge.append('feMergeNode')
            .attr('in", "offsetBlur')
        feMerge.append('feMergeNode')
            .attr('in', 'SourceGraphic');
        return "url(#" + id + ")"
    }

    d3wb.appendXAxis = function(cv, x) {
        applyCss()
        cv.svg.append("g")
            .attr("transform", "translate(0," + cv.hei + ")")
            .attr("class", "axis")
            .call(d3.axisBottom(x));
    }

    d3wb.appendYAxisRight = function(cv, y) {
        applyCss()
        return cv.svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + cv.wid + ",0)")
            .call(d3.axisRight(y))
    }

    d3wb.appendYAxis = function(cv, y) {
        applyCss()
        return cv.svg
            .append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y));
    }

    d3wb.appendXAxisLabel = function(cv, textContent) {
        return cv.svg.append("text") // text label for the x axis
            .attr("transform", "translate(" + (cv.wid / 2) + " ," + (cv.hei + cv.mar.bottom) + ")")
            .style("text-anchor", "middle")
            .style("fill", d3wb.color.foreground)
            .attr("alignment-baseline", "ideographic")
            .text(textContent);
    }

    d3wb.appendRotatedYAxisLabel = function(cv, textContent) {
        return cv.svg.append("text") // text label for the x axis
            .attr("transform", "translate(-" + cv.mar.left + "," + (cv.hei / 2) + ") rotate(-90) ")
            .style("text-anchor", "middle")
            .style("fill", d3wb.color.foreground)
            .attr("alignment-baseline", "hanging")
            .text(textContent);
    }

    d3wb.appendRotatedYAxisLabelRight = function(cv, textContent) {
        return cv.svg.append("text")
            .attr("transform", "translate(" + (cv.wid + cv.mar.right - 5) +
                "," + (cv.hei / 2) + ") rotate(90) ")
            .style("text-anchor", "middle")
            .style("fill", d3wb.color.foreground)
            .attr("alignment-baseline", "hanging")
            .text(textContent);
    }


    d3wb.appendTitle = function(cv, textContent) {
        if (textContent === undefined) {
            return
        }
        cv.svg.append("text")
            .attr("id", "figure-title")
            .attr("x", (cv.wid / 2))
            .attr("y", 0 - (cv.mar.top / 1.5))
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("fill", d3wb.color.foreground)
            .style("font-size", "120%")
            .text(textContent);
    }

    d3wb.appendHint = function(cv, textContent) {
        if (textContent === undefined) {
            return
        }
        textContent = textContent.trim()
        var g = cv.svg.append("g").attr("id", "figure-hint")
        var pad = 5
        var box = g.append("rect")
        var text = g.append("text").attr("id", "figure-hint")
        var split = textContent.split("\n")
        for (var i in split) {
            text.append("tspan")
                .style("text-anchor", "middle")
                .style("alignment-baseline", "ideographic")
                .style("font-size", "80%")
                .style("fill", d3wb.color.foreground)
                .attr("x", cv.wid + cv.mar.right - pad)
                .attr("dy", function() {
                    return i == 0 ? 0 : 15
                })
                .text(split[i])
        }
        var txtBox = text.node().getBBox()
        text.attr("transform", "translate(-" +
            (txtBox.width / 2 - pad) + ",0)")
        box.attr("rx", "5").attr("ry", "5")
            .attr("width", txtBox.width)
            .attr("height", txtBox.height)
            .attr("x", txtBox.x - txtBox.width / 2 + pad)
            .attr("y", txtBox.y)
            .style("fill", d3wb.color.foreground)
            .style("opacity", 0.1)
    }

    d3wb.appendTitleAbsolute = function(cv, textContent) {
        var title = cv.canvas.append("g")
            .attr("id", "figure-title")
            .attr("transform", "translate(" +
                ((cv.wid + cv.mar.left + cv.mar.right) / 2) +
                ",5)")
        title.append("text")
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "hanging")
            .style("fill", d3wb.color.foreground)
            .style("font-size", "120%")
            .text(textContent);
    }

})()

d3wb.button = function() {

    var x = 0
    var y = 0
    var id = "d3wb-button-1"
    var padding = 3
    var callback = function() {}
    var label = "Hello"
    var fontSize = "100%"

    var redraw = function() {

        var btn = d3.select("#" + id)
        var txt = btn.select("text")
        var rect = btn.select("rect")
        txt.text(label)

        var bbox = txt.node().getBBox();
        rect
            .attr("x", bbox.x)
            .attr("y", bbox.y)
            .attr("width", bbox.width + padding * 2)
            .attr("height", bbox.height + padding * 2)
            .attr("ry", 5).attr("rx", 5)
            .on("click", callback)
            .style("cursor", "pointer")
            .style("fill", d3wb.color.blue)
            .style("fill-opacity", ".3")
            .style("stroke", d3wb.color.cyan)
            .style("stroke-width", "1.5px");

        var rectBbox = rect.node().getBBox();
        btn.attr("transform", "translate(" + x + "," +
            (y - rectBbox.y) + ")")

    }


    function button(selection) {

        selection.each(function(data, i) {
            var sel = d3.select(this)
            var btn = sel.append("g").attr("id", id)
            var rect = btn.append("rect")
            var text = btn.append("text")
                .attr("pointer-events", "none")
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "hanging")
                .style("cursor", "pointer")
                .style("font-size", fontSize)
                .style("fill", d3wb.color.foreground)
                .attr("transform", "translate(" + padding + "," + padding + ")")
            redraw()
        })
    }

    button.x = function(value) {
        if (!arguments.length) return x
        x = value;
        return button;
    }

    button.y = function(value) {
        if (!arguments.length) return y
        y = value;
        return button;
    }

    button.label = function(value) {
        if (!arguments.length) return label
        label = value;
        return button;
    }

    button.callback = function(value) {
        if (!arguments.length) return callback
        callback = value;
        return button;
    }

    button.fontSize = function(value) {
        if (!arguments.length) return fontSize
        fontSize = value;
        return button;
    }

    button.update = function() {
        redraw()
    }

    return button
}