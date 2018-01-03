/**
 * d3-workbench (d3wb) core library.
 *
 * Convenience functionality to setup basic SVG DOM-elements according to
 * surrounding DIV properties or provided configuration.
 * Also providing visual debug functionality such as displaying a debug
 * canvas with the SVG's margin and dimensions configuration.
 *
 * @author BastiTee
 */
(function(global, factory) {
    if (global.d3 === undefined) {
        throw new Error('d3 required but not loaded.');
    }
    typeof exports === 'object' && typeof module !== 'undefined' ?
        factory(exports) : typeof define === 'function' &&
        define.amd ? define(['exports'], factory) :
        (factory((global.d3wb = global.d3wb || {})));
}(this, (function(exports) {
    'use strict';

    /* Symbol constant */
    d3wb.symbol = {
        mean: 'Ø',
        median: 'x̃',
        sum: 'Σ',
    };

    let standaloneBodyId = '#standalone-body';

    d3wb.config = function() {
        let dc = {
            /* Desired width of SVG element */
            width: getDocumentDimension('Width'),
            /* Desired height of SVG element */
            height: getDocumentDimension('Height'),
            /* Desired inner margins of SVG element */
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            },
            /* If set, will recalibrate dimensions to fit div with given id.
             * This option overrides any width/height settings. */
            parentDivId: null,
            /* If set, will not select the next best svg but
             * the one with the given id
             */
            svgId: null,
            /* Print out debug messages and debug canvas */
            debug: false,
            /* Background color (use theme default if available)*/
            bgColor: getWbColorOrDefault(),
            /* Interal datasource */
            datasrc: undefined,
        };
        /* Generic setter method for attributes */
        dc.attr = function(key, value) {
            if (key === undefined || value === undefined) {
                return;
            }
            key = String(key).trim();
            if (typeof value === 'string') {
                value = String(value).trim();
            }
            if (key.match(/^margin\..+$/)) {
                // margin access with sublevel, e.g., 'margin.top'
                let split = key.split('.');
                this[split[0]][split[1]] = +value;
                return this;
            } else if (key == 'margin' &&
                String(value).match(
                    /^[0-9]+[ ]+[0-9]+[ ]+[0-9]+[ ]+[0-9]+$/)) {
                // margin accessw with TRBL mode
                let split = value.split(/[ ]+/);
                this['margin'] = {
                    top: +split[0],
                    right: +split[1],
                    bottom: +split[2],
                    left: +split[3],
                };
                return this;
            } else {
                // default key access, e.g. 'width'
                this[key] = value;
                return this;
            }
        };
        /* Setter method for the data source */
        dc.data = function(value) {
            if (!arguments.length) return this.datasrc;
            this.datasrc = value;
            return this;
        };
        /* Initializer when configuration object is ready */
        dc.toCanvas = function() {
            return toCanvas(this);
        };
        return dc;
    };

    const toCanvas = function(config) {
        resolveEmbeddedDiv(config);

        if (!isVoid(config.parentDivId) &&
            !config.parentDivId.startsWith('#')) {
            config.parentDivId = '#' + config.parentDivId;
        }
        if (!isVoid(config.svgId) &&
            !config.svgId.startsWith('#')) {
            config.svgId = '#' + config.svgId;
        }

        recalibrateByDiv(config);

        config.innerWidth = config.width -
            config.margin.left - config.margin.right;
        config.innerHeight = config.height -
            config.margin.top - config.margin.bottom;

        let svg;
        if (!isVoid(config.svgId) &&
            d3.select(config.svgId).node() != null) {
            svg = d3.select(config.svgId);
        } else {
            svg = d3.select('svg');
        }

        svg
            .attr('width', config.width)
            .attr('height', config.height);
        svg.append('rect')
            .attr('width', config.width)
            .attr('height', config.height)
            .attr('fill', config.bgColor);

        // if standalone-svg div is present, make background the same color
        d3.select(standaloneBodyId)
            .style('background-color', config.bgColor);

        drawDebugCanvas(svg, config);
        drawDebugGroup(svg, config);

        let g = svg.append('g')
            .attr('transform',
                'translate(' + config.margin.left + ',' +
                config.margin.top + ')');

        let cv = g; // default object is the drawable canvas
        cv.svg = svg;
        // canvas width without margins (here goes the viz)
        cv.width = config.innerWidth;
        cv.wid = config.innerWidth;
        cv.w = config.innerWidth;
        // canvas height without margins (here goes the viz)
        cv.height = config.innerHeight;
        cv.hei = config.innerHeight;
        cv.h = config.innerHeight;
        // canvas margins (space around the viz)
        cv.margin = config.margin;
        cv.mar = config.margin;
        cv.m = config.margin;
        // data
        cv.data = config.data();
        cv.d = config.data();
        // embedding
        cv.div = d3.select(config.parentDivId ? config.parentDivId :
            standaloneBodyId);
        // helper method for circular visualizaions
        cv.transformCircular = function() {
            this.attr('transform', 'translate(' +
                (this.w / 2 + this.m.left) + ',' +
                (this.h / 2 + this.m.top) + ')');
        };
        return cv;
    };

    const resolveEmbeddedDiv = function(config) {
        let scriptElements = document.getElementsByTagName('script');
        if (isVoid(scriptElements) || scriptElements.length == 0) {
            return undefined;
        }
        let scriptPath = scriptElements[
            scriptElements.length - 1].src.split('/');

        if (isVoid(scriptPath) || scriptPath.length < 2) {
            return undefined;
        }
        scriptPath = scriptPath[scriptPath.length - 2];
        let scriptEl = scriptElements[scriptElements.length - 1];
        let embedded = scriptEl.getAttribute('embedded') || false;
        if (config.debug) {
            console.log('scri-path | ' + scriptPath);
            console.log('embedded  | ' + embedded);
        }
        if (!embedded) {
            return;
        }
        config.svgId = scriptEl.getAttribute('svgid') || false;
        config.parentDivId = scriptEl.getAttribute('divid') || false;
        let dataPath = scriptEl.getAttribute('datapath') || undefined;
        setPathToData(config, dataPath);
        if (config.debug) {
            console.log('svg-id    | ' + config.svgId);
            console.log('parent-id | ' + config.parentDivId);
            console.log('data-path | ' + dataPath);
            console.log('res-path  | ' + config.datasrc);
        }
    };

    let isUrl = function(path) {
        if (path === undefined) {
            return false;
        }
        if (path.match(/^(https?).*/)) {
            return true;
        }
        return false;
    };

    const setPathToData = function(config, path) {
        if (config.datasrc === undefined) {
            return;
        }
        if (typeof config.datasrc === 'string' ||
            config.datasrc instanceof String) {
            if (isUrl(config.datasrc)) {
                return;
            }
            config.datasrc = path + '/' + config.datasrc;
            return;
        }
        for (let i = 0; i < config.datasrc.length; i++) {
            if (isUrl(config.datasrc[i])) {
                continue;
            }
            config.datasrc[i] = path + '/' + config.datasrc[i];
        }
    };

    const nf = d3.format('.1f');

    const drawDebugCanvas = function(svg, config) {
        if (!config.debug) {
            return;
        }
        svg.append('rect')
            .attr('width', config.width)
            .attr('height', config.height)
            .attr('fill', getWbColorOrDefault('lightgrey'));
        svg.append('text')
            .attr('x', config.width)
            .attr('fill', getWbColorOrDefault())
            .style('dominant-baseline', 'hanging')
            .style('text-anchor', 'end')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(nf(config.width) + 'x' + nf(config.height));
        svg.append('rect')
            .attr('width', config.margin.left)
            .attr('height', config.margin.top)
            .attr('fill', getWbColorOrDefault('verylightgrey'));
        svg.append('text')
            .attr('font-size', '80%')
            .attr('x', config.margin.left / 2)
            .attr('fill', getWbColorOrDefault())
            .style('dominant-baseline', 'hanging')
            .style('text-anchor', 'middle')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(nf(config.margin.left));
        svg.append('text')
            .attr('font-size', '80%')
            .attr('y', config.margin.top / 2)
            .attr('fill', getWbColorOrDefault())
            .style('dominant-baseline', 'middle')
            .style('text-anchor', 'begin')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(nf(config.margin.top));
        svg.append('rect')
            .attr('x', config.width - config.margin.right)
            .attr('y', config.height - config.margin.bottom)
            .attr('width', config.margin.right)
            .attr('height', config.margin.bottom)
            .attr('fill', getWbColorOrDefault('verylightgrey'));
        svg.append('text')
            .attr('font-size', '80%')
            .attr('x', config.width - config.margin.right / 2)
            .attr('y', config.height)
            .attr('fill', getWbColorOrDefault())
            .style('dominant-baseline', 'baseline')
            .style('text-anchor', 'middle')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(nf(config.margin.right));
        svg.append('text')
            .attr('font-size', '80%')
            .attr('x', config.width).attr('y',
                config.height - config.margin.bottom / 2)
            .attr('fill', getWbColorOrDefault())
            .style('dominant-baseline', 'middle')
            .style('text-anchor', 'end')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(nf(config.margin.bottom));
    };

    const drawDebugGroup = function(svg, config) {
        if (!config.debug) {
            return;
        }
        let g = svg.append('g');
        g.append('rect')
            .attr('width', config.innerWidth)
            .attr('height', config.innerHeight)
            .attr('fill', getWbColorOrDefault('grey'));
        g.append('text')
            .attr('x', config.innerWidth)
            .attr('fill', getWbColorOrDefault())
            .style('dominant-baseline', 'hanging')
            .style('text-anchor', 'end')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(nf(config.innerWidth) + 'x' + nf(config.innerHeight));
        g.append('circle')
            .attr('cx', config.innerWidth / 2).attr('cy',
                config.innerHeight / 2)
            .attr('r', 5).attr('fill', getWbColorOrDefault());
        g.append('line')
            .attr('x1', 0).attr('x2', config.innerWidth / 2)
            .attr('y1', 0).attr('y2', config.innerHeight / 2)
            .attr('stroke-width', 1).attr('stroke', getWbColorOrDefault());
        g.append('line')
            .attr('x1', config.innerWidth).attr('x2', config.innerWidth / 2)
            .attr('y1', config.innerHeight).attr('y2', config.innerHeight / 2)
            .attr('stroke-width', 1).attr('stroke', getWbColorOrDefault());
        g.append('line')
            .attr('x1', config.innerWidth).attr('x2', config.innerWidth / 2)
            .attr('y1', 0).attr('y2', config.innerHeight / 2)
            .attr('stroke-width', 1).attr('stroke', getWbColorOrDefault());
        g.append('line')
            .attr('x1', 0).attr('x2', config.innerWidth / 2)
            .attr('y1', config.innerHeight).attr('y2', config.innerHeight / 2)
            .attr('stroke-width', 1).attr('stroke', getWbColorOrDefault());
        g.attr('transform',
            'translate(' + config.margin.left + ',' + config.margin.top + ')');
    };

    const recalibrateByDiv = function(config) {
        // return if div id not set
        if (isVoid(config.parentDivId)) {
            return;
        }
        // return if div id not found
        if (d3.select(config.parentDivId).node() == null) {
            return;
        }

        let bbox = d3.select(config.parentDivId).node().getBoundingClientRect();
        let newWid = bbox.width;
        if (newWid < 1) {
            newWid = config.width;
        }
        let newHei = bbox.height;
        config.width = newWid;
        config.height = newHei;
    };

    const isVoid = function(object) {
        return (
            typeof object === 'undefined' ||
            object === null ||
            object === '');
    };

    const getDocumentDimension = function(dim) {
        return Math.max(
            document.documentElement['client' + dim],
            document.body['scroll' + dim],
            document.documentElement['scroll' + dim],
            document.body['offset' + dim],
            document.documentElement['offset' + dim]);
    };

    const getWbColorOrDefault = function(color) {
        let libPresent = d3wb.theme !== undefined;
        switch (color) {
            case 'grey':
                return libPresent ? d3wb.color.background.fade(30) :
                'rgb(192, 192, 192)';
            case 'lightgrey':
                return libPresent ? d3wb.color.background.fade(20) :
                'rgb(162, 162, 162)';
            case 'verylightgrey':
                return libPresent ? d3wb.color.background.fade(10) :
                'rgb(132, 132, 132)';
            default:
                return libPresent ? d3wb.color.background :
                'rgb(255, 255, 255)';
        }
    };

    return d3wb;
})));
