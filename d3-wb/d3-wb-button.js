function wbButton() {
    "use strict";

    var x = 0
    var y = 0
    var padding = 3
    var callback = function() {}
    var label = "Hello"
    var fontSize = "80%"
    var foreground = "white"
    var background = "red"
    var maxChars
    var updateLabel = function() {}

    function button(selection) {

        selection.each(function(data, i) {
            var sel = d3.select(this)
            var btn = sel.append("g")
            var rect = btn.append("rect")
            var text = btn.append("text")
                .attr("pointer-events", "none")
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "hanging")
                .style("cursor", "pointer")
                .style("font-size", fontSize)
                .style("fill", foreground)
                .attr("transform", "translate(" + padding + "," + padding + ")")

            updateLabel = function() {
                // setup text label with X's to avoid problems with non 
                // mono fonts and the bounding boxes
                maxChars = Math.max(maxChars, label.length) || label.length
                text.text(Array(maxChars).join("X"))
                var bbox = text.node().getBBox();
                // create the rect 
                rect
                    .attr("x", bbox.x)
                    .attr("y", bbox.y)
                    .attr("width", bbox.width + padding * 2)
                    .attr("height", bbox.height + padding * 2)
                    .attr("ry", 5).attr("rx", 5)
                    .on("click", callback)
                    .style("cursor", "pointer")
                    .style("fill", background)
                    .style("fill-opacity", ".3")
                var rectBbox = rect.node().getBBox()
                btn.attr("transform", "translate(" + x + "," +
                    (y - rectBbox.y) + ")")
                // reset the label 
                text.text(label)
            }
            updateLabel()
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
        if (value === undefined || value == "") return button
        label = value.trim();
        updateLabel(label)
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

    button.maxChars = function(value) {
        if (!arguments.length) return maxChars
        maxChars = value;
        return button;
    }

    button.foreground = function(value) {
        if (!arguments.length) return foreground
        foreground = value;
        return button;
    }

    button.background = function(value) {
        if (!arguments.length) return background
        background = value;
        return button;
    }

    return button
}