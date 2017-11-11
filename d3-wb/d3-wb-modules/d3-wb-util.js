(function() {
    "use strict";

    var changeCSVSeparator = function(sep) {
        d3.csv = function(url, callback) {
            d3.request(url)
                .mimeType("text/csv")
                .response(function(xhr) {
                    return d3.dsvFormat(sep).parse(xhr.responseText);
                })
                .get(callback);
        }
    }

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

    function websafeGuid() {
        return "d3wb-" + guid()
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
     */
    var jsonAttributeMapToCSV = function(json) {
        // create header
        var header = ["key"]
        for (var objKey in json[Object.keys(json)[0]]) {
            header.push(objKey) // add all object keys of first object 
        }
        // create csv output
        var csv = ["\"" + header.join("\",\"") + "\""]
        for (var key in json) {
            var csvRow = [key]
            for (var h in header) {
                if (h == 0) {
                    continue
                }
                var selector = header[h]
                csvRow.push(json[key][selector])
            }
            csv.push("\"" + csvRow.join("\",\"") + "\"")
        }
        // parse CSV string to d3-like CSV object 
        var csvString = csv.join("\n")
        var csvResult = d3.csvParse(csvString)
        // fin.
        return csvResult
    }

    var getBoundingBoxCenter = function(selection) {
        // get the DOM element from a D3 selection
        // you could also use "this" inside .each()
        var element = d3.select(selection).node();
        // use the native SVG interface to get the bounding box
        var bbox = element.getBBox();
        // return the center of the bounding box
        return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
    }

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
        getBoundingBoxCenter: getBoundingBoxCenter
    }

})()