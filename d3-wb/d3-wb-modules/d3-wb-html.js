(function() {
    "use strict";

    function commonElements(chart) {
        var c = {
            "id": d3wb.util.websafeGuid(),
            "div": d3.select("body"),
            "callback": function() {
                console.log("callback.")
            },
            "callbackOnInit": false
        }

        chart.id = function(value) {
            if (!arguments.length) return "#" + c.id
            id = value;
            return chart;
        }

        chart.style = function(key, value) {
            d3wb.util.injectCSS(`
                    #` + c.id + ` {
                        ` + key + `: ` + value + `;
                    }
                `)
            return chart;
        }

        chart.callback = function(value) {
            if (!arguments.length) return c.callback
            c.callback = value;
            return chart;
        }

        return c
    }

    var dropdown = function() {

        var options = ["Option 1", "Option 2", "Option 3"]

        function chart(selection) {

            selection = resolve(selection)

            selection.each(function() {
                var s = d3.select(this)

                var callbackImpl = function() {
                    var value = d3.select("#" + c.id).property("value")
                    var index = options.indexOf(value)
                    c.callback(value, index)
                }

                var selectDistrict = s
                    .append("select")
                    .attr("id", c.id)
                    .on("change", callbackImpl)
                selectDistrict
                    .selectAll("option")
                    .data(options).enter()
                    .append("option")
                    .text(function(d) {
                        return d;
                    });
                d3wb.util.injectCSS(`
                        #` + c.id + ` {
                            position: absolute;
                        }
                    `)
                callbackImpl()
            })
        }

        var c = commonElements(chart)

        chart.options = function(value) {
            if (!arguments.length) return options
            options = value;
            return chart;
        }

        return chart
    }

    var button = function() {

        var options = ["Click me"]
        var index = 0
        var buttonEl

        function chart(selection) {

            selection = resolve(selection)

            selection.each(function() {
                var s = d3.select(this)

                var callbackImpl = function() {
                    var value = d3.select("#" + c.id).text()
                    var idx = options.indexOf(value)
                    index = (index + 1) % (options.length)
                    c.callback(value, idx)
                    buttonEl.text(options[index])
                }

                buttonEl = s
                    .append("button")
                    .attr("id", c.id)
                    .text(options[index])
                    .on("click", callbackImpl)

                d3wb.util.injectCSS(`
                        #` + c.id + ` {
                            position: absolute;
                        }
                    `)
                if (c.callbackOnInit) {
                    callbackImpl()
                }
            })
        }

        var c = commonElements(chart)

        chart.options = function(value) {
            if (!arguments.length) return options
            options = value;
            return chart;
        }

        return chart
    }

    var textfield = function() {

        function chart(selection) {

            selection = resolve(selection)

            selection.each(function() {
                var s = d3.select(this)

                var callbackImpl = function(element) {
                    c.callback(element.value)
                }

                var input = s
                    .append("input")
                    .attr("id", c.id)
                    .on("input", function() {
                        callbackImpl(this)
                    })

                d3wb.util.injectCSS(`
                        #` + c.id + ` {
                            position: absolute;
                        }
                    `)
            })
        }

        var c = commonElements(chart)

        return chart
    }

    function resolve(selection) {
        // check for cv.div parameter. If available use it instead,
        // it means user using d3wb but called cv.call() instead of 
        // cv.div.call()
        if (selection["div"] !== undefined) {
            return selection["div"]
        }
        return selection;
    }

    d3wb.html = {
        dropdown: dropdown,
        button: button,
        textfield: textfield
    }

})()