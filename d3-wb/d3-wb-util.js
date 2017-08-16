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

    var reduceData = function(data, xSel, ySel, window) {
        var windowArr = []
        var reducedData = data.filter(function(value, index) {
            windowArr.push(value[ySel])
            if (index % window == 0 || index == data.length - 1) {
                var windowMean = d3.mean(windowArr)
                var result = {
                    xSel: value[xSel],
                    ySel: windowMean
                }
                windowArr = []
                return result;
            };
        });
        return reducedData;
    }

    var countCsvColumn = function(data, column, sort) {
        sort = sort === undefined ? true : sort
        var nestedData = d3.nest()
            .key(function(d) {
                return d[column];
            })
            .entries(data);
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

    d3wb.util = {
        setLocale: setLocale,
        reduceData: reduceData,
        countCsvColumn: countCsvColumn
    }

})()