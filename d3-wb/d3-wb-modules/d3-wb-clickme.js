/* exported wbClickMe */
/**
 * Click handler to be assigned to any DOM-element.
 * @return {Object} A reusable, updatable click object.
 */
function wbClickMe() {
    'use strict';

    // let supportedEvents = ['dblclick'];
    let supportedActions = ['open'];

    let event = 'dblclick';
    let action = 'open';
    let openTarget = function(d, i) {
        return 'https://d3js.org/';
    };

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);
            if (action == 'open') {
                s.on(event, function(d, i) {
                    let trg = openTarget(d, i);
                    window.open(trg, '_blank');
                });
            }
        });
    };

    chart.event = function(value) {
        if (!arguments.length) return event;
        event = value;
        return chart;
    };

    chart.action = function(value) {
        if (!arguments.length) return action;
        if (!supportedActions.includes(value)) {
            throw new Error('Action \'' + value +
             '\' not supported! Allowed: ' + supportedActions);
        }
        action = value;
        return chart;
    };

    chart.openTarget = function(value) {
        if (!arguments.length) return openTarget;
        openTarget = value;
        return chart;
    };

    return chart;
};
