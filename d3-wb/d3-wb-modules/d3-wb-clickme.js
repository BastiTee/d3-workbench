function wbClickMe() {
    "use strict";

    var supportedEvents = ["dblclick"]
    var supportedActions = ["open"]

    var event = "dblclick"
    var action = "open"
    var openTarget = function(d, i) {
        return "https://d3js.org/"
    }

    function chart(selection) {
        selection.each(function(data, i) {
            var s = d3.select(this)
            if (action == "open") {
                s.on(event, function(d, i) {
                    var trg = openTarget(d, i)
                    window.open(trg, '_blank')
                })
            }

        })
    }

    chart.event = function(value) {
        if (!arguments.length) return event
        event = value;
        return chart;
    }

    chart.action = function(value) {
        if (!arguments.length) return action
        if (!supportedActions.includes(value)) {
            throw new Error("Action '" + value + "' not supported! Allowed: " + supportedActions);
        }
        action = value;
        return chart;
    }

    chart.openTarget = function(value) {
        if (!arguments.length) return openTarget
        openTarget = value;
        return chart;
    }

    return chart
}