(function() {
    "use strict";

    var injectAxisColor = function(color, cclass) {
        d3wb.util.injectCSS(`
        .` + cclass + ` line{
          stroke: ` + color + `;
        }
        .` + cclass + ` path{
          stroke: ` + color + `;
        }
        .` + cclass + ` text{
          fill: ` + color + `;
        }  
        `)
    }

    var xAxis = function(scale) {

        var color = "red"
        var type = d3.axisTop
        var y = 0
        var rotation = undefined

        function chart(selection) {

            selection.each(function(data, i) {
                injectAxisColor(color, "wb-axis-x")
                var s = d3.select(this)
                var axis = s.append("g")
                    .attr("transform", "translate(0," + y + ")")
                    .attr("class", "wb-axis wb-axis-x").call(type(scale))
                if (rotation == 90 ) {
                    axis.selectAll("text")
                        .attr("y", -2)
                        .attr("x", -9)
                        .attr("dy", ".35em")
                        .style("text-anchor", "end")
                        .attr("transform", "rotate(-90)")
                }
            })
        }

        chart.type = function(value) {
            if (!arguments.length) return type
            type = value;
            return chart;
        }

        chart.y = function(value) {
            if (!arguments.length) return y
            y = value;
            return chart;
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.rotation = function(value) {
            if (!arguments.length) return rotation
            rotation = value;
            return chart;
        }

        return chart
    }

    var xAxisBottom = function(scale) {
        return xAxis(scale).type(d3.axisBottom)
    }

    var yAxis = function(scale) {

        var color = "red"
        var type = d3.axisLeft
        var x = 0

        function chart(selection) {

            selection.each(function(data, i) {
                injectAxisColor(color, "wb-axis-y")
                var s = d3.select(this)
                s.append("g")
                    .attr("class", "wb-axis wb-axis-y")
                    .attr("transform", "translate(" + x + ",0)")
                    .call(type(scale))
            })
        }

        chart.type = function(value) {
            if (!arguments.length) return type
            type = value;
            return chart;
        }

        chart.x = function(value) {
            if (!arguments.length) return x
            x = value;
            return chart;
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        return chart
    }

    var yAxisRight = function(scale) {
        return yAxis(scale).type(d3.axisRight)
    }

    var title = function(text) {

        var color = "red"
        var fontSize = "140%"
        
        var update = function () {}

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()
                s.append("text")
                    .attr("class", "wb-title")
                    .attr("x", root.width / 2)
                    .attr("text-anchor", "middle")
                    .attr("alignment-baseline", "hanging")
                    .style("fill", color)
                    .style("font-size", fontSize)
                    
                update = function() {
                    s.selectAll(".wb-title").text(text)
                }
                update()
            })
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.fontSize = function(value) {
            if (!arguments.length) return fontSize
            fontSize = value;
            return chart;
        }
        
        chart.text = function(value) {
            if (!arguments.length) return text
            text = value
            return chart;
        }
        
        chart.update = function() {
            update()
        }
        
        return chart
    }

    var xAxisLabel = function(text) {

        var color = "red"
        var padding = 10
        var orientation = "top"

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()
                s.append("text") // text label for the x axis
                    .attr("transform", function() {
                        var t = "translate(" + (root.width / 2) + ","
                        if (orientation == "top")
                            t += padding
                        else
                            t += root.height - padding
                        t += ")"
                        return t
                    })
                    .style("text-anchor", "middle")
                    .style("fill", color)
                    .attr("alignment-baseline", function() {
                        if (orientation == "top")
                            return "hanging"
                        else
                            return "auto"
                    })
                    .text(text);
            })
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.orientation = function(value) {
            if (!arguments.length) return orientation
            orientation = value;
            return chart;
        }
        return chart
    }

    var yAxisLabel = function(text) {

        var color = "red"
        var padding = 10
        var orientation = "left"

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()
                s.append("text") // text label for the x axis
                    .attr("transform", function() {
                        var t = "translate("
                        if (orientation == "left")
                            t += padding
                        else
                            t += root.width - padding
                        t += "," + root.height / 2 + ") rotate("
                        if (orientation == "left")
                            t += "-90"
                        else
                            t += "90"
                        t += ")"
                        return t
                    })
                    .style("text-anchor", "middle")
                    .style("fill", color)
                    .attr("alignment-baseline", "hanging")
                    .text(text)

            })
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.orientation = function(value) {
            if (!arguments.length) return orientation
            orientation = value;
            return chart;
        }
        return chart
    }

    var infoBox = function(text) {

        var color = "white"
        var fill = "red"
        var fontSize = "80%"
        var padding = 10
        var margin = 10
        var opacity = 0.8
        var lineHeight = 15
        var orientation = "topright"

        function chart(selection) {

            selection.each(function(data, i) {
                var s = d3.select(this.ownerSVGElement)
                var root = s.node().getBBox()
                var g = s.append("g")
                var box = g.append("rect")
                var textG = g.append("text")
                var split = text.split("\n")
                for (var i in split) {
                    textG.append("tspan")
                        .style("text-anchor", "end")
                        .style("alignment-baseline", "hanging")
                        .style("font-size", fontSize)
                        .style("fill", color)
                        .attr("x", 0)
                        .attr("dy", function() {
                            return i == 0 ? 0 : lineHeight
                        })
                        .text(split[i])
                }
                var txtBox = textG.node().getBBox()
                box.attr("rx", "5").attr("ry", "5")
                    .attr("width", txtBox.width + padding * 2)
                    .attr("height", txtBox.height + padding * 2)
                    .attr("x", txtBox.x - padding)
                    .attr("y", txtBox.y - padding)
                    .style("fill", fill)
                    .style("opacity", opacity)
                var xAbs = root.width - margin - padding
                var yAbs = padding + margin
                g.attr("transform", "translate(" + xAbs + "," + yAbs + ")")
            })
        }

        chart.color = function(value) {
            if (!arguments.length) return color
            color = value;
            return chart;
        }

        chart.fill = function(value) {
            if (!arguments.length) return fill
            fill = value;
            return chart;
        }

        chart.orientation = function(value) {
            if (!arguments.length) return orientation
            orientation = value;
            return chart;
        }
        return chart
    }

    var shadow = function() {

        var blur = 3
        var xOffset = 2
        var yOffset = 1
        var opacity = 0.4
        var id = d3wb.util.guid()

        function chart(selection) {

            selection.each(function() {
                var s = d3.select(this)
                var svg = d3.select(this.ownerSVGElement)
                var defs = svg.append('defs');
                var filter = defs.append('filter')
                    .attr('id', id)
                filter.append('feGaussianBlur')
                    .attr('in', 'SourceAlpha')
                    .attr('stdDeviation', blur)
                    .attr('result', 'blur')
                filter.append('feOffset')
                    .attr('in', 'blur')
                    .attr('dx', xOffset)
                    .attr('dy', yOffset)
                    .attr('result', 'offsetBlur');
                filter.append('feComponentTransfer')
                    .append('feFuncA')
                    .attr('type', 'linear')
                    .attr("slope", opacity)
                var feMerge = filter.append('feMerge');
                feMerge.append('feMergeNode')
                    .attr('in", "offsetBlur')
                feMerge.append('feMergeNode')
                    .attr('in', 'SourceGraphic');

                s.style("filter", "url(#" + id + ")")
            })
        }
        return chart
    }

    d3wb.add = {
        xAxis: xAxis,
        xAxisBottom: xAxisBottom,
        xAxisLabel: xAxisLabel,
        yAxis: yAxis,
        yAxisRight: yAxisRight,
        yAxisLabel: yAxisLabel,
        title: title,
        infoBox: infoBox,
        shadow: shadow
    }

})()
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
                .style("user-select", "none")
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
(function() {
    "use strict";

    var themes = {
        dark: {
            background: "#1D1F21",
            black: "#282A2E",
            blue: "#5F819D",
            cyan: "#5E8D87",
            foreground: "#C5C8C6",
            green: "#8C9440",
            magenta: "#85678F",
            red: "#A54242",
            white: "#707880",
            yellow: "#DE935F"
        },
        gotham: {
            background: "#0A0F14",
            black: "#0A0F14",
            blue: "#195465",
            cyan: "#33859D",
            foreground: "#98D1CE",
            green: "#26A98B",
            magenta: "#4E5165",
            red: "#C33027",
            white: "#98D1CE",
            yellow: "#EDB54B"
        },
        light: {
            background: "#FFFFFF",
            black: "#000000",
            blue: "#87AFDF",
            cyan: "#AFDFDF",
            foreground: "#1A1D1D",
            green: "#AFD787",
            magenta: "#DFAFDF",
            red: "#D78787",
            white: "#FFFFFF",
            yellow: "#FFFFAF"
        },
        monokai: {
            background: "#272822",
            black: "#272822",
            blue: "#66D9EF",
            cyan: "#A1EFE4",
            foreground: "#F8F8F2",
            green: "#A6E22E",
            magenta: "#AE81FF",
            red: "#F92672",
            white: "#F8F8F2",
            yellow: "#F4BF75"
        },
        ocean: {
            background: "#2B303B",
            black: "#2B303B",
            blue: "#8FA1B3",
            cyan: "#96B5B4",
            foreground: "#C0C5CE",
            green: "#A3BE8C",
            magenta: "#B48EAD",
            red: "#BF616A",
            white: "#C0C5CE",
            yellow: "#EBCB8B"
        },
        sweetlove: {
            background: "#1F1F1F",
            black: "#4A3637",
            blue: "#535C5C",
            cyan: "#6D715E",
            foreground: "#C0B18B",
            green: "#7B8748",
            magenta: "#775759",
            red: "#D17B49",
            white: "#C0B18B",
            yellow: "#AF865A"
        },
        tomorrowlight: {
            background: "#FFFFFF",
            black: "#1D1F21",
            blue: "#81A2BE",
            cyan: "#8ABEB7",
            foreground: "#373B41",
            green: "#B5BD68",
            magenta: "#B294BB",
            red: "#CC6666",
            white: "#C5C8C6",
            yellow: "#F0C674"
        },
        yousay: {
            background: "#F5E7DE",
            black: "#666661",
            blue: "#4C7399",
            cyan: "#D97742",
            foreground: "#34302D",
            green: "#4C3226",
            magenta: "#BF9986",
            red: "#992E2E",
            white: "#34302D",
            yellow: "#A67C53"
        },
    }

    var extendColor = function(colorObj, colorName) {
        colorObj.name = colorName
        colorObj.fade = function(pct) {
            var lohi = lohiScaleArray(colorObj.name, 100)
            return lohi[pct]
        }
        return colorObj
    }

    var castColor = function(color) {
        var label = color
        if (typeof color === "string" && !color.startsWith("rgb")) {
            color = d3.rgb(d3wb.color[color])
            color = extendColor(color, label)
        }
        return color
    }

    var array = function(arr) {
        var newArr = []
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].startsWith("#")) {
                newArr.push("" + d3.rgb(arr[i]))
            } else {
                newArr.push("" + d3wb.color(arr[i]))
            }
        }
        return newArr
    }

    var category = function() {
        var colors = ["blue", "red", "green", "magenta", "foreground"]
        var category = []
        for (var i = 0; i < colors.length; i++) {
            var subCat = d3wb.color.lohiScaleArray(colors[i], 5, [0.6, 0.6])
            category = category.concat(subCat)
        }
        return category
    }

    var interpolateToArray = function(ipol, length, loHiBound) {
        loHiBound = loHiBound || [0.0, 1.0]
        if (length <= 2) {
            return [ipol(0), ipol(1)]
        }
        var step = (loHiBound[1] - loHiBound[0]) / (length)
        var pt = loHiBound[0] + step
        var arr = []
        arr.push(ipol(loHiBound[0]))
        do {
            arr.push(ipol(pt))
            pt += step
        } while (pt < loHiBound[1] - step - 0.0001)
        arr.push(ipol(loHiBound[1]))
        return arr
    }

    var gradientArray = function(color1, color2, length, loHiBound) {
        color1 = castColor(color1)
        color2 = castColor(color2)
        var ipl = d3.interpolateRgb(color1, color2)
        return interpolateToArray(ipl, length, loHiBound)
    }

    var lohiScaleArray = function(color, length, limits) {
        limits = limits || [0.4, 0.7]
        var even = length % 2 == 0
        var substeps = even ? length / 2 : (length + 1) / 2
        var loAr = gradientArray("black", color, even ?
            substeps + 1 : substeps, [limits[0], 1.0])
        var hiAr = gradientArray(color, "white",
            substeps, [0.0, limits[1]])
        var res = loAr.concat(hiAr.slice(1))
        // console.log(length + " = " + (even ? substeps + 1 : substeps) +
        // " + " + substeps + " >> " + res.length );
        return res
    }

    var ordinal = function() {
        return d3.scaleOrdinal(d3wb.color.category());
    }
    
    var smallOrdinal = function() {
        var smallCategory = []
        for (var i = 2; i < 25; i += 5) {
            smallCategory.push(d3wb.color.category()[i]);
        }
        return d3.scaleOrdinal(smallCategory);
    }

    var linearGradient = function(minMax, fromTo) {
        fromTo = fromTo || [d3wb.color.white, d3wb.color.black]
        return d3.scaleLinear().domain(minMax)
            .interpolate(d3.interpolate)
            .range(fromTo);
    }

    var quantile = function(minMax, colors) {
        return d3.scaleQuantile()
            .domain(minMax).range(colors);
    }

    // sets up theme function that invokes d3wb.color object as well
    d3wb.theme = function(theme) {
        if (!arguments.length) {
            var keys = Object.keys(d3wb.color)
            var colors = []
            for (var i in keys) {
                if (typeof d3wb.color[keys[i]] !== "function") {
                    colors.push(d3wb.color[keys[i]].name)
                }
            }
            return colors
        }
        var newTheme = themes[theme]
        // setup color object with public methods 
        var color = {
            lohiScaleArray: lohiScaleArray,
            array: array,
            gradientArray: gradientArray,
            category: category,
            quantile: quantile,
            linearGradient: linearGradient,
            ordinal: ordinal,
            smallOrdinal: smallOrdinal
        }
        // add directy accessible colors 
        for (var key in newTheme) {
            color[key] = d3.rgb(newTheme[key])
            color[key] = extendColor(color[key], key)
        }
        // make public 
        d3wb.color = color
    }

    d3wb.theme("light") // sets default theme 

})()
function wbCooltip() {
    "use strict";

    var opacity = 0.8
    var padding = 5
    var color = "white"
    var fill = "black"
    var lineHeight = 20
    var roundCorners = 5
    var selector = function() {
        return new Date().toDateString() + "\n" +
            String(Math.floor(Math.random() * 9e8))
    }

    function chart(selection) {

        selection.each(function(data, i) {
            var s = d3.select(this)
            var root = this.ownerSVGElement
            var dim = root.getBBox()
            var active = false
            var gTooltip, rect, text

            var mousemove = function() {
                var pos = d3.mouse(root)
                var txtBox = rect.node().getBBox()
                var newx = pos[0]
                var newy = pos[1] - txtBox.height
                // STOP ON BORDERS
                // left side 
                newx = newx - (txtBox.width / 2) < 0 ?
                    txtBox.width / 2 : newx
                // right side
                newx = newx + (txtBox.width / 2) > dim.width ?
                    dim.width - (txtBox.width / 2) : newx
                // top side
                newy = newy - padding < 0 ? padding : newy
                // bottom side 
                newy = newy + txtBox.height - padding > dim.height ?
                    dim.height - txtBox.height + padding : newy
                // move 
                gTooltip.attr("transform", "translate(" +
                    newx + "," + newy + ")")
            }

            var mouseout = function() {
                if (!active) {
                    return
                }
                active = false
                gTooltip.remove()
            }

            var mouseover = function(d) {
                if (active) {
                    return
                }
                active = true
                gTooltip = d3.select(root).append("g")
                    .style("pointer-events", "none")
                rect = gTooltip.append("rect")
                text = gTooltip.append("text")
                // append tooltip text
                var string = "" + selector(d)
                var split = string.split("\n")
                for (var i in split) {
                    text.append("tspan")
                        .style("text-anchor", "middle")
                        .style("alignment-baseline", "hanging")
                        .style("fill", color)
                        .attr("x", 0)
                        .attr("dy", function() {
                            return i == 0 ? 0 : lineHeight
                        })
                        .text(split[i])
                }
                // append background rectangle depending on text size
                var txtBox = text.node().getBBox()
                rect
                    .attr("rx", roundCorners).attr("ry", roundCorners)
                    .attr("width", txtBox.width + padding * 2)
                    .attr("height", txtBox.height + padding * 2)
                    .attr("x", -(txtBox.width / 2) - padding)
                    .attr("y", -padding)
                    .attr("opacity", opacity)
                    .style("fill", fill)
            }

            s.on("mouseover", mouseover)
            s.on("mouseout", mouseout)
            s.on("mousemove", mousemove)

        })
    }

    chart.opacity = function(value) {
        if (!arguments.length) return opacity
        opacity = value;
        return chart;
    }

    chart.padding = function(value) {
        if (!arguments.length) return padding
        padding = value;
        return chart;
    }

    chart.color = function(value) {
        if (!arguments.length) return color
        color = value;
        return chart;
    }

    chart.fill = function(value) {
        if (!arguments.length) return fill
        fill = value;
        return chart;
    }

    chart.lineHeight = function(value) {
        if (!arguments.length) return lineHeight
        lineHeight = value;
        return chart;
    }

    chart.roundCorners = function(value) {
        if (!arguments.length) return roundCorners
        roundCorners = value;
        return chart;
    }

    chart.selector = function(value) {
        if (!arguments.length) return selector
        selector = value;
        return chart;
    }

    return chart
}
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
(function() {
    "use strict";

    var setLocale = function(lang) {
        if (lang == "de") {
            d3.timeFormat = d3.timeFormatLocale({
                "dateTime": "%A, der %e. %B %Y, %X",
                "date": "%d.%m.%Y",
                "time": "%H:%M:%S",
                "periods": ["AM", "PM"],
                "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
                "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
                "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
                "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
            }).format
        } else {
            throw "Unsupported locale."
        }
    }

    var guid = function() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    var s4 = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    var smoothData = function(data, xSel, ySel, window) {
        var windowArr = []
        var winAggs = []
        // for each window create an aggregated value
        data.forEach(function(value, index) {
            var innerIdx = index + 1
            windowArr.push(value[ySel])
            if (innerIdx % window == 0 || innerIdx == data.length) {
                var winAgg = d3.median(windowArr)
                winAggs.push(winAgg)
                windowArr = []
            };
        });
        // recreate original array size 
        var smoothData = []
        var covered = 0
        var finalPt = 0
        for (var i in winAggs) {
            var aggr = winAggs[i]
            covered += window
            var winLen = covered > data.length ? data.length % window : window
            var left = i == 0 ? data[0][ySel] : winAggs[i - 1]
            var right = winAggs[i]
            var ip = d3.interpolate(left, right)
            var shift = 1.0 / winLen
            var curr = 0
            for (var j = 0; j < winLen; j++) {
                curr += shift
                var set = {}
                set[xSel] = data[finalPt][xSel]
                set[ySel] = ip(curr)
                smoothData.push(set)
                finalPt += 1
            }
        }
        return smoothData;
    }

    var countCsvColumn = function(data, column, sort, ignore) {
        sort = sort === undefined ? true : sort
        var nestedData = d3.nest()
            .key(function(d) {
                return d[column];
            })
            .entries(data);
        if (ignore !== undefined && ignore.length > 0) {
            nestedData = nestedData.filter(function(d) {
                return !ignore.includes(d.key)
            })
        }
        var countData = []
        for (var i = 0; i < nestedData.length; i++) {
            var sub_obj = {
                "label": nestedData[i].key,
                "count": +nestedData[i].values.length
            }
            countData.push(sub_obj)
        }
        var sum = d3.sum(countData, function(d) {
            return +d.count;
        })
        countData.forEach(function(d) {
            d.percent = (+d.count / sum) * 100
        });
        if (sort) {
            countData.sort(function(a, b) {
                return b.percent - a.percent
            })
        }
        return countData
    }


    var injectCSS = function(css) {
        var head = document.getElementsByTagName('head')[0];
        var s = document.createElement('style');
        if (s.styleSheet) { // IE
            s.styleSheet.cssText = css;
        } else { // the world
            s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
    }


    var logSVGSize = function(selection) {
        var b = selection.ownerSVGElement.getBBox()
        console.log(b.x + " x " + b.y + " | " + b.width + " x " + b.height)
    }

    d3wb.util = {
        setLocale: setLocale,
        smoothData: smoothData,
        countCsvColumn: countCsvColumn,
        guid: guid,
        injectCSS: injectCSS,
        logSVGSize: logSVGSize
    }

})()
