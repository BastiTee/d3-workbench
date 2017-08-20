function wbTextbox() {
    /* Inspired by: http://grokbase.com/t/gg/d3-js/14ctc4dbh6/
     * how-can-i-make-text-editable-inside-svg-node
     */

    /* Public variables */
    var text = "Search..."
    var x = 10
    var y = 10
    var width = 120
    var height = 40
    var fontSize = "80%"
    var fill = "red"
    var fillSelected = "orange"
    var color = "white"
    var colorSelected = "white"
    var stroke = "darkred"
    var strokeSelected = "darkorange"
    var alwaysCallback = true // call callback on any new input text 
    var returnEmpty = true // call callback on empty input text
    var returnLowercase = true // return lowercase text?
    var callback = function(text) {
        console.log("textbox-callback '" + text + "'");
    }

    /* Private variables */

    var debug = false
    var rectNode
    var textNode
    var cursorNode
    var focused = false

    var logInt = function(log) {
        if (debug)
            console.log(log);
    }

    var callbackInternal = function(text) {
        if (text === undefined) { // always return unfocus-indicator
            callback(text)
            return
        }
        if (returnLowercase) {
            text = text.toLowerCase()
        }

        if (text !== "") {
            callback(text)
        } else if (returnEmpty) {
            callback(text)
        }
    }

    var alignText = function() {
        textB = textNode.node().getBoundingClientRect()
        curB = cursorNode.node().getBoundingClientRect()
        textNode.attr("x", .5 * (width - textB.width));
        textNode.attr("y", .5 * (height - textB.height));
        cursorNode.attr("x", width / 2 + textB.width / 2)
        if (textB.height > 0) {
            cursorNode.attr("y", .5 * (height - textB.height))
        } else {
            cursorNode.attr("y", .5 * (height - curB.height))
        }
    };

    var keydown = function() {
        if (!focused) return;
        var code = d3.event.keyCode;
        logInt("-- keydown=" + code);
        var inputText = textNode.text()
        var definedControls = [8, 13, 27]
        if (code < 27 && !definedControls.includes(code)) {
            return
        }
        if (code == 8) { // Backspace
            d3.event.preventDefault();
            inputText = inputText.substring(0, inputText.length - 1);
            textNode.text(inputText)
            alignText()
            if (alwaysCallback) {
                callbackInternal(inputText)
            }
        }
        if (code == 13) { // Enter
            callbackInternal(inputText)
            // inputText = inputText.trim()
        }
        if (code == 27) { // Escape
            rectNode.style("stroke", stroke)
            rectNode.style("fill", fill)
            cursorNode.attr("opacity", 0)
            focused = false
            // answer undefined so caller can reset
            callbackInternal(undefined)
        }
    }

    var keypress = function() {
        var code = d3.event.keyCode;
        logInt("-- keypress=" + code);
        if (code <= 27) {
            return
        }
        var inputText = textNode.text()
        inputText = inputText + String.fromCharCode(code);
        textNode.text(inputText)
        alignText()
        if (alwaysCallback) {
            callbackInternal(inputText)
        }
    }

    function chart(selection) {

        selection.each(function() {

            var s = d3.select(this)

            d3.select("body")
                .on("keydown", keydown)
                .on("keypress", keypress)
                .on("click", function() {
                    if (focused) {
                        rectNode.attr("stroke", stroke)
                        rectNode.attr("fill", fill)
                        focused = false;
                    }
                });

            var textgroup = s.append("g")
                .attr("transform", "translate(" + x + "," + y + ")");

            rectNode = textgroup.append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("rx", 5)
                .style("fill", fill)
                .style("stroke-width", "1px")
                .style("stroke", stroke)
                .style("opacity", 1);
            textNode = textgroup.append("text")
                .text(text)
                .style("font-size", fontSize)
                .style("alignment-baseline", "hanging")
                .style("fill", color)
            cursorNode = textgroup.append("text")
                .style("alignment-baseline", "hanging")
                .style("font-size", fontSize)
                .style("fill", color)
                .text("|")
                .attr("opacity", 0)
            var cover = textgroup.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("opacity", 0);
            cover.on("click", function() {
                focused = true;
                rectNode.style("stroke", strokeSelected)
                rectNode.style("fill", fillSelected)
                cursorNode.attr("opacity", 1)
                d3.event.stopPropagation();
            })

            alignText()

        })
    }

    chart.callback = function(value) {
        if (!arguments.length) return callback
        callback = value;
        return chart;
    }

    chart.text = function(value) {
        if (!arguments.length) return text
        text = value;
        return chart;
    }

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    chart.fillSelected = function(value) {
        if (!arguments.length) return fillSelected
        fillSelected = value;
        return chart;
    }

    chart.stroke = function(value) {
        if (!arguments.length) return stroke
        stroke = value;
        return chart;
    }

    chart.strokeSelected = function(value) {
        if (!arguments.length) return strokeSelected
        strokeSelected = value;
        return chart;
    }

    chart.color = function(value) {
        if (!arguments.length) return color
        color = value;
        return chart;
    }

    chart.colorSelected = function(value) {
        if (!arguments.length) return colorSelected
        colorSelected = value;
        return chart;
    }

    chart.text = function(value) {
        if (!arguments.length) return text
        text = value;
        return chart;
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

    chart.x = function(value) {
        if (!arguments.length) return x
        x = value;
        return chart;
    }

    chart.y = function(value) {
        if (!arguments.length) return y
        y = value;
        return chart;
    }

    chart.returnEmpty = function(value) {
        if (!arguments.length) return returnEmpty
        returnEmpty = value;
        return chart;
    }

    chart.returnLowercase = function(value) {
        if (!arguments.length) return returnLowercase
        returnLowercase = value;
        return chart;
    }

    return chart;
}