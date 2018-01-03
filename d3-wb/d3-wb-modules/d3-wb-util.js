/**
 * d3-workbench (d3wb) 'util' extension module.
 *
 * A collection of utility functions to reduce boilerplate and to
 * speed up visualization development.
 *
 * @author BastiTee
 */
(function(global, factory) {
    if (global.d3wb === undefined) {
        throw new Error('d3wb required but not loaded.');
    }
    typeof exports === 'object' && typeof module !== 'undefined' ?
        factory(exports) : typeof define === 'function' &&
        define.amd ? define(['exports'], factory) :
        (factory((global.d3wb.util = global.d3wb.util || {})));
}(this, (function(exports) {
    'use strict';

    /* *********************************************************************
     * PUBLIC FUNCTIONS
     * ********************************************************************* */

    const changeCSVSeparator = function(sep) {
        d3.csv = function(url, callback) {
            d3.request(url)
                .mimeType('text/csv')
                .response(function(xhr) {
                    return d3.dsvFormat(sep).parse(xhr.responseText);
                })
                .get(callback);
        };
    };

    const setLocale = function(lang) {
        if (lang == 'de') {
            d3.timeFormat = d3.timeFormatLocale({
                'dateTime': '%A, der %e. %B %Y, %X',
                'date': '%d.%m.%Y',
                'time': '%H:%M:%S',
                'periods': ['AM', 'PM'],
                'days': ['Sonntag', 'Montag', 'Dienstag',
                'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                'shortDays': ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                'months': ['Januar', 'Februar', 'März', 'April',
                'Mai', 'Juni', 'Juli', 'August', 'September',
                'Oktober', 'November', 'Dezember'],
                'shortMonths': ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai',
                'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            }).format;
        } else {
            throw new Error('Unsupported locale.');
        }
    };

    const guid = function() {
        return randomString() + randomString() + '-' + randomString()
        + '-' + randomString() + '-' + randomString() + '-'
        + randomString() + randomString() + randomString();
    };

    const websafeGuid = function() {
        return 'd3wb-' + guid();
    };

    const smoothData = function(data, xSel, ySel, window) {
        let windowArr = [];
        let winAggs = [];
        // for each window create an aggregated value
        data.forEach(function(value, index) {
            let innerIdx = index + 1;
            windowArr.push(value[ySel]);
            if (innerIdx % window == 0 || innerIdx == data.length) {
                let winAgg = d3.median(windowArr);
                winAggs.push(winAgg);
                windowArr = [];
            };
        });
        // recreate original array size
        let smoothData = [];
        let covered = 0;
        let finalPt = 0;
        for (let i in winAggs) {
            if (!Object.prototype.hasOwnProperty.call(winAggs, i)) {
                continue;
            }
            covered += window;
            let winLen = covered > data.length ? data.length % window : window;
            let left = i == 0 ? data[0][ySel] : winAggs[i - 1];
            let right = winAggs[i];
            let ip = d3.interpolate(left, right);
            let shift = 1.0 / winLen;
            let curr = 0;
            for (let j = 0; j < winLen; j++) {
                curr += shift;
                let set = {};
                set[xSel] = data[finalPt][xSel];
                set[ySel] = ip(curr);
                smoothData.push(set);
                finalPt += 1;
            }
        }
        return smoothData;
    };

    const countCsvColumn = function(data, column, sort, ignore) {
        sort = sort === undefined ? true : sort;
        let nestedData = d3.nest()
            .key(function(d) {
                return d[column];
            })
            .entries(data);
        if (ignore !== undefined && ignore.length > 0) {
            nestedData = nestedData.filter(function(d) {
                return !ignore.includes(d.key);
            });
        }
        let countData = [];
        for (let i = 0; i < nestedData.length; i++) {
            let subObj = {
                'label': nestedData[i].key,
                'count': +nestedData[i].values.length,
            };
            countData.push(subObj);
        }
        let sum = d3.sum(countData, function(d) {
            return +d.count;
        });
        countData.forEach(function(d) {
            d.percent = (+d.count / sum) * 100;
        });
        if (sort) {
            countData.sort(function(a, b) {
                return b.percent - a.percent;
            });
        }
        return countData;
    };


    const injectCSS = function(css) {
        let head = document.getElementsByTagName('head')[0];
        let s = document.createElement('style');
        if (s.styleSheet) { // IE
            s.styleSheet.cssText = css;
        } else { // the world
            s.appendChild(document.createTextNode(css));
        }
        head.appendChild(s);
    };


    const logSVGSize = function(selection) {
        let b = selection.ownerSVGElement.getBBox();
        console.log(b.x + ' x ' + b.y + ' | ' + b.width + ' x ' + b.height);
    };

    /**
     * A method to convert a JSON object holding K/V-pairs like..
     *
     * {
     *      "object_1": {
     *          "key1": "value1",
     *          "key2": "value2"
     *      },
     *     "object_2": { .. }
     * }
     *
     * to a parsed CSV object like...
     *
     * key, key1, key2
     * object_1, value1, value2
     * object_2, ..
     *
     * Method assumes that each object has same attributes.
     * @param {Object} json Input json data
     * @return {Array} Converted csv data
     */
    const jsonAttributeMapToCSV = function(json) {
        // create header
        let header = ['key'];
        let jsonMap = json[Object.keys(json)[0]];
        for (let objKey in jsonMap) {
            if (Object.prototype.hasOwnProperty.call(jsonMap, objKey)) {
                header.push(objKey); // add all object keys of first object
            }
        };
        // create csv output
        let csv = ['"' + header.join('","') + '"'];
        for (let key in json) {
            if (!Object.prototype.hasOwnProperty.call(json, key)) {
                continue;
            }
            let csvRow = [key];
            for (let h in header) {
                if (h == 0) {
                    continue;
                }
                let selector = header[h];
                csvRow.push(json[key][selector]);
            }
            csv.push('"' + csvRow.join('","') + '"');
        }
        // parse CSV string to d3-like CSV object
        let csvString = csv.join('\n');
        let csvResult = d3.csvParse(csvString);
        // fin.
        return csvResult;
    };

    const getBoundingBoxCenter = function(selection) {
        // get the DOM element from a D3 selection
        // you could also use "this" inside .each()
        let element = d3.select(selection).node();
        // use the native SVG interface to get the bounding box
        let bbox = element.getBBox();
        // return the center of the bounding box
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    };

    /* *********************************************************************
     * PUBLIC API
     * ********************************************************************* */

    d3wb.util = {
        setLocale: setLocale,
        changeCSVSeparator: changeCSVSeparator,
        smoothData: smoothData,
        countCsvColumn: countCsvColumn,
        guid: guid,
        websafeGuid: websafeGuid,
        injectCSS: injectCSS,
        logSVGSize: logSVGSize,
        jsonAttributeMapToCSV: jsonAttributeMapToCSV,
        getBoundingBoxCenter: getBoundingBoxCenter,
    };

    /* *********************************************************************
     * PRIVATE FUNCTIONS
     * ********************************************************************* */

    let randomString = function() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
})));
