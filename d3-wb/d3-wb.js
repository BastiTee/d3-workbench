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

    /** **********************************************************************
     * PRIVATE CONSTANTS
     ************************************************************************/

    const CSS_PREFIX = 'wb-';
    const STANDALONE_BODY_ID = '#' + CSS_PREFIX + 'standalone-body';
    const SYMBOLS = {
        mean: 'Ø',
        median: 'x̃',
        sum: 'Σ',
    };
    const numberFormat = d3.format('.1f');

    /** **********************************************************************
     * GLOBAL CSS PREFIXING
     ************************************************************************/

    const cssPrefix = function(cssIdentifier) {
        let split = cssIdentifier.trim().replace(/ +/g, ' ').split(' ');
        let pfxSplit = [];
        split.forEach(function(d) {
            pfxSplit.push(CSS_PREFIX + d);
        });
        return pfxSplit.join(' ');
    };

    const cssSelector = function(cssIdentifier) {
        return '.' + CSS_PREFIX + cssIdentifier;
    };

    const cssIdSelector = function(cssIdentifier) {
        return '#' + CSS_PREFIX + cssIdentifier;
    };

    /** **********************************************************************
     * CANVAS CONFIGURATION
     ************************************************************************/

    const configureCanvas = function() {

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
            bgColor: d3wb.defaultBgColor || 'rgb(255, 255, 255)',
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

    /** **********************************************************************
     * CANVAS CREATION
     ************************************************************************/

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

        svg.attr('width', config.width)
            .attr('height', config.height)
            .style('margin-left', 'auto')
            .style('margin-top', 'auto');

        // if standalone-svg div is present, make background the same color
        // and remove margins and paddings
        d3.select(STANDALONE_BODY_ID)
            .style('background-color', config.bgColor)
            .style('margin', 0)
            .style('overflow', 'hidden');

        svg.append('rect')
            .attr('class', d3wb.prefix('svg-background'))
            .attr('width', config.width)
            .attr('height', config.height)
            .attr('fill', config.bgColor);

        if (config.debug) {
            let debugGroup = svg.append('g')
                .attr('class', d3wb.prefix('debug'));
            drawDebugCanvas(debugGroup, config);
            drawDebugGroup(debugGroup, config);
        }

        let g = svg.append('g')
            .attr('class', d3wb.prefix('inner-canvas'))
            .attr('transform',
                'translate(' + config.margin.left + ',' +
                config.margin.top + ')');

        let divId = config.parentDivId ? config.parentDivId :
            STANDALONE_BODY_ID;
        // inject position relative to DIV otherwise html elements
        // will not be positioned correctly
        d3.select(divId).style('position', 'relative');

        // default object is the drawable canvas
        let cv = g;
        // parent SVG object
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
        // svg size including margins
        cv.widthFull = config.innerWidth + config.margin.left +
            config.margin.right;
        cv.heightFull = config.innerHeight + config.margin.top +
            config.margin.bottom;
        // data
        cv.data = config.data();
        cv.d = config.data();
        // embedding
        cv.div = d3.select(divId);
        // parent div
        cv.parentDivId = divId;
        // helper method for circular visualizaions
        cv.transformCircular = function() {
            this.attr('transform', 'translate(' +
                (this.w / 2 + this.m.left) + ',' +
                (this.h / 2 + this.m.top) + ')');
        };
        return cv;
    };

    /** **********************************************************************
     * PRIVATE METHODS
     ************************************************************************/

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
        let embedded = scriptEl.getAttribute('embedded') ||
            scriptEl.getAttribute('data-embedded') || false;
        if (config.debug) {
            console.log('--------- | ---------');
            console.log('scri-path | ' + scriptPath);
            console.log('embedded  | ' + embedded);
        }
        if (!embedded) {
            return;
        }
        config.svgId = scriptEl.getAttribute('svgid') ||
            scriptEl.getAttribute('data-svgid') || false;
        config.parentDivId = scriptEl.getAttribute('divid') ||
            scriptEl.getAttribute('data-divid') || false;
        let dataPath = scriptEl.getAttribute('datapath') ||
            scriptEl.getAttribute('data-datapath') || undefined;
        setPathToData(config, dataPath);
        if (config.debug) {
            console.log('svg-id    | ' + config.svgId);
            console.log('parent-id | ' + config.parentDivId);
            console.log('data-path | ' + dataPath);
            console.log('res-path  | ' + config.datasrc);
        }
    };

    const isUrl = function(path) {
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

    /** **********************************************************************
     * PRIVATE METHODS FOR DEBUGGING CANVAS DRAWING
     ************************************************************************/

    const drawDebugCanvas = function(svg, config) {
        let g = svg.append('g')
            .attr('class', d3wb.prefix('debug-outer'));
        g.append('rect')
            .attr('width', config.width)
            .attr('height', config.height)
            .attr('fill', 'rgb(162, 162, 162)');
        g.append('text')
            .attr('x', config.width)
            .attr('fill', 'rgb(255, 255, 255)')
            .style('dominant-baseline', 'hanging')
            .style('text-anchor', 'end')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(numberFormat(config.width) + 'x' +
                numberFormat(config.height));
        g.append('rect')
            .attr('width', config.margin.left)
            .attr('height', config.margin.top)
            .attr('fill', 'rgb(132, 132, 132)');
        g.append('text')
            .attr('font-size', '80%')
            .attr('x', config.margin.left / 2)
            .attr('fill', 'rgb(255, 255, 255)')
            .style('dominant-baseline', 'hanging')
            .style('text-anchor', 'middle')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(numberFormat(config.margin.left));
        g.append('text')
            .attr('font-size', '80%')
            .attr('y', config.margin.top / 2)
            .attr('fill', 'rgb(255, 255, 255)')
            .style('dominant-baseline', 'middle')
            .style('text-anchor', 'begin')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(numberFormat(config.margin.top));
        g.append('rect')
            .attr('x', config.width - config.margin.right)
            .attr('y', config.height - config.margin.bottom)
            .attr('width', config.margin.right)
            .attr('height', config.margin.bottom)
            .attr('fill', 'rgb(132, 132, 132)');
        g.append('text')
            .attr('font-size', '80%')
            .attr('x', config.width - config.margin.right / 2)
            .attr('y', config.height)
            .attr('fill', 'rgb(255, 255, 255)')
            .style('dominant-baseline', 'baseline')
            .style('text-anchor', 'middle')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(numberFormat(config.margin.right));
        g.append('text')
            .attr('font-size', '80%')
            .attr('x', config.width).attr('y',
                config.height - config.margin.bottom / 2)
            .attr('fill', 'rgb(255, 255, 255)')
            .style('dominant-baseline', 'middle')
            .style('text-anchor', 'end')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(numberFormat(config.margin.bottom));
    };

    const drawDebugGroup = function(svg, config) {
        let g = svg.append('g')
            .attr('class', d3wb.prefix('debug-inner'));
        g.append('rect')
            .attr('width', config.innerWidth)
            .attr('height', config.innerHeight)
            .attr('fill', 'rgb(192, 192, 192)');
        g.append('text')
            .attr('x', config.innerWidth)
            .attr('fill', 'rgb(255, 255, 255)')
            .style('dominant-baseline', 'hanging')
            .style('text-anchor', 'end')
            .style('-moz-user-select', 'none')
            .style('user-select', 'none')
            .text(numberFormat(config.innerWidth) + 'x' +
                numberFormat(config.innerHeight));
        g.append('circle')
            .attr('cx', config.innerWidth / 2).attr('cy',
                config.innerHeight / 2)
            .attr('r', 5).attr('fill', 'rgb(255, 255, 255)');
        g.append('line')
            .attr('x1', 0).attr('x2', config.innerWidth / 2)
            .attr('y1', 0).attr('y2', config.innerHeight / 2)
            .attr('stroke-width', 1).attr('stroke', 'rgb(255, 255, 255)');
        g.append('line')
            .attr('x1', config.innerWidth).attr('x2', config.innerWidth / 2)
            .attr('y1', config.innerHeight).attr('y2', config.innerHeight / 2)
            .attr('stroke-width', 1).attr('stroke', 'rgb(255, 255, 255)');
        g.append('line')
            .attr('x1', config.innerWidth).attr('x2', config.innerWidth / 2)
            .attr('y1', 0).attr('y2', config.innerHeight / 2)
            .attr('stroke-width', 1).attr('stroke', 'rgb(255, 255, 255)');
        g.append('line')
            .attr('x1', 0).attr('x2', config.innerWidth / 2)
            .attr('y1', config.innerHeight).attr('y2', config.innerHeight / 2)
            .attr('stroke-width', 1).attr('stroke', 'rgb(255, 255, 255)');
        g.attr('transform',
            'translate(' + config.margin.left + ',' + config.margin.top + ')');
    };

    /** **********************************************************************
     * PUBLIC API
     ************************************************************************/

    d3wb = {
        /* Core configuration endpoint for canvas creation */
        config: configureCanvas,
        /* Prefix given space-separated css classes */
        prefix: cssPrefix,
        /* Get CSS class selector with internal prefix */
        selector: cssSelector,
        /* Get CSS id selector with internal prefix */
        idSelector: cssIdSelector,
        /* Symbol constants */
        symbol: SYMBOLS,
    };

    return d3wb;
})));
