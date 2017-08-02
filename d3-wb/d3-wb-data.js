(function() {
    "use strict";

    d3wb.reduceData = function(data, xSel, ySel, window) {
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

    d3wb.countCsvColumn = function(data, column) {
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
        countData.sort(function(a, b) {
            return b.percent - a.percent
        })
        return countData
    }

})()
