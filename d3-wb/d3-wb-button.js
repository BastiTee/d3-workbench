function wbButton() {
    "use strict";

    var getMaxChars = function(labels) {
        return d3.max(labels, function(d) {
            return d.length
        })
    }
    var x = 0
    var y = 0
    var padding = 3
    var callback = function() {
        updateLabels()
        console.log("d3wb: button clicked");
    }
    var labels = ["Button State", "Another State"]
    var pointer = -1
    var maxChars = getMaxChars(labels)
    var fontSize = "80%"
    var color = "white"
    var fill = "red"
    var fillHighlight = "orange"
    var pulse = true
    var opacity = 0.8
    var updateLabels = function() {}
    var buttonGroup;

    function button(selection) {

        selection.each(function(data, i) {
            var sel = d3.select(this)
            buttonGroup = sel.append("g").attr("class", "wb-button")
            var rect = buttonGroup.append("rect")
            var text = buttonGroup.append("text")

            text.attr("pointer-events", "none")
                .attr("text-anchor", "left")
                .attr("alignment-baseline", "hanging")
                .style("cursor", "pointer")
                .style("font-size", fontSize)
                .style("fill", color)
                .attr("transform", "translate(" + padding + "," + padding + ")")

            updateLabels = function() {
                // setup text label with X's to avoid problems with non  
                // mono fonts and the bounding boxes
                maxChars = getMaxChars(labels)
                text.text(Array(maxChars).join("X"))
                var bbox = text.node().getBBox();
                // create the rect 
                rect
                    .attr("x", bbox.x)
                    .attr("y", bbox.y)
                    .attr("width", bbox.width + padding * 2)
                    .attr("height", bbox.height + padding * 2)
                    .attr("ry", 5).attr("rx", 5)
                    .style("cursor", "pointer")
                    .style("fill", fill)
                    .style("fill-opacity", opacity)
                    .on("click", function() {
                        pulse = false // user discovered the button
                        callback()
                    })
                    .on("mouseover", function(d, i) {
                        pulse = false // user discovered the button
                        d3.select(this)
                            .transition()
                            .duration(250)
                            .style("fill", fillHighlight)
                            .attr("stroke", color)
                            .attr("stroke-width", 1)

                    })
                    .on("mouseout", function(d, i) {
                        d3.select(this)
                            .transition()
                            .duration(250)
                            .style("fill", fill)
                            .attr("stroke-width", 0)
                    })

                var rectBbox = rect.node().getBBox()
                buttonGroup.attr("transform", "translate(" + x + "," +
                    (y - rectBbox.y) + ")")
                // reset the label
                pointer = (pointer + 1) % labels.length
                text.text(labels[pointer])
                bbox = text.node().getBBox()
                // move bounding box so text is centered 
                var diff = rectBbox.width - bbox.width
                rect.attr("transform", "translate(" +
                    (-diff / 2 + padding) + ",0)")
                // move button to original location
                buttonGroup.attr("transform", "translate(" +
                    (x + diff / 2) + "," + y + ")")
            }
            updateLabels()
            setInterval(function() {
                if (!pulse) {
                    return
                }
                rect
                    .transition()
                    .duration(500)
                    .style("fill", fillHighlight)
                    .attr("stroke", color)
                    .attr("stroke-width", 1)
                    .transition()
                    .duration(500)
                    .style("fill", fill)
                    .attr("stroke-width", 0)
            }, 5000);

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

    button.labels = function(value) {
        if (!arguments.length) return labels
        labels = value
        return button;
    }

    button.callback = function(value) {
        if (!arguments.length) return callback
        callback = function() {
            updateLabels()
            value()
        }
        return button;
    }

    button.fontSize = function(value) {
        if (!arguments.length) return fontSize
        fontSize = value;
        return button;
    }

    button.color = function(value) {
        if (!arguments.length) return color
        color = value;
        return button;
    }

    button.fillHighlight = function(value) {
        if (!arguments.length) return fillHighlight
        fillHighlight = value;
        return button;
    }

    button.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return button;
    }

    button.opacity = function(value) {
        if (!arguments.length) return opacity
        opacity = value;
        return button;
    }

    button.pulse = function(value) {
        if (!arguments.length) return pulse
        pulse = value;
        return button;
    }

    return button
}