/**
 * d3-workbench (d3wb) 'html' extension module.
 *
 * A collection of reusable HTML elements to extend visualizations
 * with interactive elements such as dropdowns, buttons or text fields.
 *
 * @author BastiTee
 */
(function(global, factory) {
    if (global.d3wb.util === undefined) {
        throw new Error('d3wb.util required but not loaded.');
    }
    typeof exports === 'object' && typeof module !== 'undefined' ?
        factory(exports) : typeof define === 'function' &&
        define.amd ? define(['exports'], factory) :
        (factory((global.d3wb.html = global.d3wb.html || {})));
}(this, (function(exports) {
    'use strict';

    /* *********************************************************************
     * PUBLIC FUNCTIONS
     * ********************************************************************* */

    const dropdown = function() {
        let options = ['Option 1', 'Option 2', 'Option 3'];

        let chart = function(selection) {
            selection = resolve(selection);

            selection.each(function(d, i, nodes) {
                let s = d3.select(nodes[i]);

                let callbackImpl = function() {
                    let value = d3.select('#' + c.id).property('value');
                    let index = options.indexOf(value);
                    c.callback(value, index);
                };

                let selectDistrict = s
                    .append('select')
                    .attr('id', c.id)
                    .on('change', callbackImpl);
                selectDistrict
                    .selectAll('option')
                    .data(options).enter()
                    .append('option')
                    .text(function(d) {
                        return d;
                    });
                d3wb.util.injectCSS(`
                        #` + c.id + ` {
                            position: absolute;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                        }
                    `);
                callbackImpl();
                c.autoLocate();
            });
        };

        let c = commonElements(chart);

        chart.options = function(value) {
            if (!arguments.length) return options;
            options = value;
            return chart;
        };

        return chart;
    };

    const button = function() {
        let options = ['Click me'];
        let index = 0;
        let buttonEl;

        let chart = function(selection) {
            selection = resolve(selection);

            selection.each(function(d, i, nodes) {
                let s = d3.select(nodes[i]);

                let callbackImpl = function() {
                    let value = d3.select('#' + c.id).text();
                    let idx = options.indexOf(value);
                    index = (index + 1) % (options.length);
                    c.callback(value, idx);
                    buttonEl.text(options[index]);
                };

                buttonEl = s
                    .append('button')
                    .attr('id', c.id)
                    .style('user-select', 'none')
                    .style('-moz-user-select', 'none')
                    .text(options[index])
                    .on('click', callbackImpl);

                d3wb.util.injectCSS(`
                        #` + c.id + ` {
                            position: absolute;
                        }
                    `);
                if (c.callbackOnInit) {
                    callbackImpl();
                }
                c.autoLocate();
            });
        };

        let c = commonElements(chart);

        chart.options = function(value) {
            if (!arguments.length) return options;
            options = value;
            return chart;
        };

        return chart;
    };

    const textfield = function() {
        let chart = function(selection) {
            selection = resolve(selection);

            selection.each(function(d, i, nodes) {
                let s = d3.select(nodes[i]);

                let callbackImpl = function(element) {
                    c.callback(element.value);
                };

                s
                    .append('input')
                    .attr('id', c.id)
                    .on('input', function(d, i, nodes) {
                        callbackImpl(nodes[i]);
                    });

                d3wb.util.injectCSS(`
                        #` + c.id + ` {
                            position: absolute;
                        }
                    `);
                c.autoLocate();
            });
        };

        let c = commonElements(chart);

        return chart;
    };

    const infoBox = function(text) {
        let controlColor = 'black';
        let controlColorHover = 'red';
        let controlFontSize = '150%';
        let infoColor = 'white';
        let infoFill = 'black';
        let infoFontSize = '100%';
        let infoOpacity = 0.8;
        let infoContent = text || `<b>Information</b></br>
        This box contains information about the graph. It's intended ` +
            `to guide the user. You can use <i>html-style</i> as desired.
        `;

        let open = false;

        let chart = function(selection) {
            selection = resolve(selection);

            selection.each(function(d, i, nodes) {
                let s = d3.select(nodes[i]);

                let div = s.append('div')
                    .attr('id', c.id)
                    .call(d3wb.util.makeUnselectable());

                let input = div
                    .append('p')
                    .attr('id', c.id + '-in')
                    .html('&#9432;');

                div.append('p')
                    .attr('id', c.id + '-ib')
                    .html(infoContent);

                input.on('click', function() {
                    open = !open;
                    let opac = open ? infoOpacity : 0.0;
                    d3wb.util.injectCSS(
                        '#' + c.id + '-ib { opacity: ' + opac + ';}');
                });

                d3wb.util.injectCSS(`
                    #` + c.id + ` {
                        position: absolute;
                        margin: 0;
                        padding: 0;
                        pointer-events:none;
                    }
                    #` + c.id + `-in {
                        position: relative;
                        text-align: left;
                        width: 0;
                        margin: 0;
                        padding: 0;
                        color: ` + controlColor + `;
                        font-size: ` + controlFontSize + `;
                        pointer-events: auto;
                    }
                    #` + c.id + `-in:hover {
                        cursor: default;
                        color: ` + controlColorHover + `;
                    }
                    #` + c.id + `-ib {
                        position: relative;
                        text-align: left;
                        margin: 0;
                        padding: 0.5em;
                        border-radius: 0.4em;
                        user-select: none;
                        border: 1px solid ` + infoColor + `;
                        color: ` + infoColor + `;
                        font-size: ` + infoFontSize + `;
                        background-color: ` + infoFill + `;
                        opacity: 0;
                    }
                `);
                c.autoLocate();
            });
        };

        let c = commonElements(chart);

        chart.controlColor = function(value) {
            if (!arguments.length) return controlColor;
            controlColor = value;
            return chart;
        };

        chart.controlColorHover = function(value) {
            if (!arguments.length) return controlColorHover;
            controlColorHover = value;
            return chart;
        };

        chart.controlHover = function(value) {
            if (!arguments.length) return controlHover;
            controlHover = value;
            return chart;
        };

        chart.infoColor = function(value) {
            if (!arguments.length) return infoColor;
            infoColor = value;
            return chart;
        };

        chart.infoFill = function(value) {
            if (!arguments.length) return infoFill;
            infoFill = value;
            return chart;
        };

        chart.infoContent = function(value) {
            if (!arguments.length) return infoContent;
            infoContent = value;
            return chart;
        };

        return chart;
    };

    /* *********************************************************************
     * PUBLIC API
     * ********************************************************************* */

    d3wb.html = {
        dropdown: dropdown,
        button: button,
        textfield: textfield,
        infoBox: infoBox,
    };

    /* *********************************************************************
     * PRIVATE FUNCTIONS
     * ********************************************************************* */

    let resolve = function(selection) {
        // check for cv.div parameter. If available use it instead,
        // it means user using d3wb but called cv.call() instead of
        // cv.div.call()
        if (selection['div'] !== undefined) {
            return selection['div'];
        }
        return selection;
    };

    let commonElements = function(chart) {
        let c = {
            id: d3wb.util.websafeGuid(),
            div: d3.select('body'),
            callback: function() {
                console.log('callback.');
            },
            callbackOnInit: false,
            leftOrRightSet: false, // necessary to auto-position on default
            topOrBottomSet: false, // necessary to auto-position on default
            autoLocate: function() {
                if (!this.leftOrRightSet) {
                    d3wb.util.injectCSS(`
                        #` + c.id + ` {
                            left: 0px;
                        }`);
                }
                if (!this.topOrBottomSet) {
                    d3wb.util.injectCSS(`
                        #` + c.id + ` {
                            top: 0px;
                        }`);
                }
            },
        };

        chart.id = function(value) {
            if (!arguments.length) return '#' + c.id;
            id = value;
            return chart;
        };

        chart.style = function(key, value) {
            // convert to string and check for 'px' suffix
            value = String(value);
            if (!isNaN(value) && !value.endsWith('px')) {
                value = value + 'px';
            }
            key = key.trim();
            if (key == 'left' || key == 'right') {
                c.leftOrRightSet = true;
            }
            if (key == 'bottom' || key == 'top') {
                c.topOrBottomSet = true;
            }
            d3wb.util.injectCSS(`
                #` + c.id + ` {
                    ` + key + `: ` + value + `;
                }
            `);
            return chart;
        };

        chart.callback = function(value) {
            if (!arguments.length) return c.callback;
            c.callback = value;
            return chart;
        };

        return c;
    };
})));
