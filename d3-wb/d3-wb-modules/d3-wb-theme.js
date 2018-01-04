/**
 * d3-workbench (d3wb) 'theme' extension module.
 *
 * A module to simplify working with user-defined color sets/themes.
 *
 * @author BastiTee
 */
(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
        factory(exports) : typeof define === 'function' &&
        define.amd ? define(['exports'], factory) :
        (factory((global.d3wb.theme = global.d3wb.theme || {})));
}(this, (function(exports) {
    'use strict';

    let themes = {
        dark: {
            background: '#1D1F21',
            black: '#282A2E',
            blue: '#5F819D',
            cyan: '#5E8D87',
            foreground: '#C5C8C6',
            green: '#8C9440',
            magenta: '#85678F',
            red: '#A54242',
            white: '#707880',
            yellow: '#DE935F',
        },
        eqie6: {
            background: '#111111',
            black: '#222222',
            blue: '#66A9B9',
            cyan: '#6D878D',
            foreground: '#CCCCCC',
            green: '#B7CE42',
            magenta: '#B7416E',
            red: '#E84F4F',
            white: '#CCCCCC',
            yellow: '#FEA63C',
        },
        gotham: {
            background: '#0A0F14',
            black: '#0A0F14',
            blue: '#195465',
            cyan: '#33859D',
            foreground: '#98D1CE',
            green: '#26A98B',
            magenta: '#4E5165',
            red: '#C33027',
            white: '#98D1CE',
            yellow: '#EDB54B',
        },
        light: {
            background: '#FFFFFF',
            black: '#000000',
            blue: '#87AFDF',
            cyan: '#AFDFDF',
            foreground: '#1A1D1D',
            green: '#AFD787',
            magenta: '#DFAFDF',
            red: '#D78787',
            white: '#FFFFFF',
            yellow: '#FFFFAF',
        },
        monokai: {
            background: '#272822',
            black: '#272822',
            blue: '#66D9EF',
            cyan: '#A1EFE4',
            foreground: '#F8F8F2',
            green: '#A6E22E',
            magenta: '#AE81FF',
            red: '#F92672',
            white: '#F8F8F2',
            yellow: '#F4BF75',
        },
        ocean: {
            background: '#2B303B',
            black: '#2B303B',
            blue: '#8FA1B3',
            cyan: '#96B5B4',
            foreground: '#C0C5CE',
            green: '#A3BE8C',
            magenta: '#B48EAD',
            red: '#BF616A',
            white: '#C0C5CE',
            yellow: '#EBCB8B',
        },
        sweetlove: {
            background: '#1F1F1F',
            black: '#4A3637',
            blue: '#535C5C',
            cyan: '#6D715E',
            foreground: '#C0B18B',
            green: '#7B8748',
            magenta: '#775759',
            red: '#D17B49',
            white: '#C0B18B',
            yellow: '#AF865A',
        },
        tomorrowlight: {
            background: '#FFFFFF',
            black: '#1D1F21',
            blue: '#81A2BE',
            cyan: '#8ABEB7',
            foreground: '#373B41',
            green: '#B5BD68',
            magenta: '#B294BB',
            red: '#CC6666',
            white: '#C5C8C6',
            yellow: '#F0C674',
        },
        yousay: {
            background: '#F5E7DE',
            black: '#666661',
            blue: '#4C7399',
            cyan: '#D97742',
            foreground: '#34302D',
            green: '#4C3226',
            magenta: '#BF9986',
            red: '#992E2E',
            white: '#34302D',
            yellow: '#A67C53',
        },
    };

    /* *********************************************************************
     * PUBLIC FUNCTIONS
     * ********************************************************************* */

    let array = function(arr) {
        let newArr = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].startsWith('#')) {
                newArr.push('' + d3.rgb(arr[i]));
            } else {
                newArr.push('' + d3wb.color(arr[i]));
            }
        }
        return newArr;
    };

    let category = function() {
        let colors = ['blue', 'red', 'green', 'magenta', 'foreground'];
        let category = [];
        for (let i = 0; i < colors.length; i++) {
            let subCat = d3wb.color.lohiScaleArray(colors[i], 5, [0.6, 0.6]);
            category = category.concat(subCat);
        }
        return category;
    };

    let categoryMain = function() {
        let colors = [
            'blue', 'cyan', 'green', 'magenta', 'red', 'yellow', 'foreground',
        ];
        let category = [];
        for (let i = 0; i < colors.length; i++) {
            category.push(castColor(colors[i]));
        }
        return category;
    };

    let interpolateToArray = function(ipol, length, loHiBound) {
        loHiBound = loHiBound || [0.0, 1.0];
        if (length <= 2) {
            return [ipol(0), ipol(1)];
        }
        let step = (loHiBound[1] - loHiBound[0]) / (length);
        let pt = loHiBound[0] + step;
        let arr = [];
        arr.push(ipol(loHiBound[0]));
        do {
            arr.push(ipol(pt));
            pt += step;
        } while (pt < loHiBound[1] - step - 0.0001);
        arr.push(ipol(loHiBound[1]));
        return arr;
    };

    let gradientArray = function(color1, color2, length, loHiBound) {
        color1 = castColor(color1);
        color2 = castColor(color2);
        let ipl = d3.interpolateRgb(color1, color2);
        return interpolateToArray(ipl, length, loHiBound);
    };

    let lohiScaleArray = function(color, length, limits) {
        limits = limits || [0.4, 0.7];
        let even = length % 2 == 0;
        let substeps = even ? length / 2 : (length + 1) / 2;
        let loAr = gradientArray('black', color, even ?
            substeps + 1 : substeps, [limits[0], 1.0]);
        let hiAr = gradientArray(color, 'white',
            substeps, [0.0, limits[1]]);
        let res = loAr.concat(hiAr.slice(1));
        // console.log(length + " = " + (even ? substeps + 1 : substeps) +
        // " + " + substeps + " >> " + res.length );
        return res;
    };

    let ordinal = function() {
        return d3.scaleOrdinal(d3wb.color.category());
    };

    let smallOrdinal = function() {
        let smallCategory = [];
        for (let i = 2; i < 25; i += 5) {
            smallCategory.push(d3wb.color.category()[i]);
        }
        return d3.scaleOrdinal(smallCategory);
    };

    let linearGradient = function(minMax, fromTo) {
        fromTo = fromTo || [d3wb.color.white, d3wb.color.black];
        return d3.scaleLinear().domain(minMax)
            .interpolate(d3.interpolate)
            .range(fromTo);
    };

    let quantile = function(minMax, colors) {
        return d3.scaleQuantile()
            .domain(minMax).range(colors);
    };

    /* *********************************************************************
     * PRIVATE FUNCTIONS
     * ********************************************************************* */

    let extendColor = function(colorObj, colorName) {
        colorObj.name = colorName;
        colorObj.fade = function(pct) {
            let lohi = lohiScaleArray(colorObj.name, 100);
            return lohi[pct];
        };
        return colorObj;
    };

    let castColor = function(color) {
        let label = color;
        if (typeof color === 'string' && !color.startsWith('rgb')) {
            color = d3.rgb(d3wb.color[color]);
            color = extendColor(color, label);
        }
        return color;
    };

    /* *********************************************************************
     * PUBLIC API
     * ********************************************************************* */

    // sets up theme function that invokes d3wb.color object as well
    d3wb.theme = function(theme) {
        if (!arguments.length) {
            let keys = Object.keys(d3wb.color);
            let colors = [];
            for (let i in keys) {
                if (typeof d3wb.color[keys[i]] !== 'function') {
                    colors.push(d3wb.color[keys[i]].name);
                }
            }
            return colors;
        }
        let newTheme = themes[theme];
        // setup color object with public methods
        let color = {
            lohiScaleArray: lohiScaleArray,
            array: array,
            gradientArray: gradientArray,
            category: category,
            categoryMain: categoryMain,
            quantile: quantile,
            linearGradient: linearGradient,
            ordinal: ordinal,
            smallOrdinal: smallOrdinal,
        };
        // add directy accessible colors
        for (let key in newTheme) {
            if (Object.prototype.hasOwnProperty.call(newTheme, key)) {
                color[key] = d3.rgb(newTheme[key]);
                color[key] = extendColor(color[key], key);
            }
        }
        // add a theme list
        d3wb.themes = [];
        for (let key in themes) {
            if (Object.prototype.hasOwnProperty.call(themes, key)) {
                d3wb.themes.push(key);
            }
        };
        // make public
        d3wb.color = color;
    };

    d3wb.theme('light'); // sets default theme
})));
