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