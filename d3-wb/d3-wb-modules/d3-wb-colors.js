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
    
    var categoryMain = function() {
        var colors = [
            "blue", "cyan", "green", "magenta", "red", "yellow", "foreground"]
        var category = []
        for (var i = 0; i < colors.length; i++) {
            category.push(castColor(colors[i]))
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
            categoryMain: categoryMain,
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