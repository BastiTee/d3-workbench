var d3wb = (function(d3, $) {
    "use strict";

    /* Global workbench object */
    var d3wb = {}

    /* A global toggle to enable/disable logging and debug information */
    d3wb.DEFAULT_DEBUG_STATE = false

    d3wb.initConfig = function() {
        var dc = {
            /* Desired width of SVG element */
            width: $(window).width(),
            /* Desired height of SVG element */
            height: $(window).height(),
            /* Desired inner margins of SVG element */
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            /* If set, will recalibrate dimensions to fit div with given id */
            parentDivId: null,
            /* If set, will not select the next best svg but
             * the one with the given id
             */
            svgId: null,
            /* Print out debug messages */
            debug: d3wb.DEFAULT_DEBUG_STATE,
            /* Background color */
            bgColor: d3wb.color.background,
            /* Default data path */
            datasrc: undefined
        }
        /* Generic setter method for attributes */
        dc.attr = function(key, value) {
            if (!key.match(/^margin\..+$/)) {
                // default key access, e.g. "width"
                this[key] = value
                return this
            } else {
                // key access with sublevel, e.g., "margin.top"
                var split = key.split(".")
                this[split[0]][split[1]] = value
                return this
            }
        }
        /* Setter method for the data source */
        dc.data = function(datasrc) {
            if (!arguments.length) return this.datasrc;
            this.datasrc = datasrc
            return this
        }
        /* Initializer when configuration object is ready */
        dc.initCanvas = function() {
            return initCanvas(this)
        }
        /* Initializer when configuration object is ready */
        dc.locale = function(locale) {
            d3wb.util.setLocale(locale)
            return this
        }
        return dc;
    }

    var initCanvas = function(config) {

        // setup configuration
        var dc = d3wb.initConfig()
        config = config || dc
        config.width = config.width || dc.width
        config.height = config.height || dc.height
        config.margin = config.margin || dc.margin
        config.debug = config.debug || dc.debug
        config.bgColor = config.bgColor || dc.bgColor

        resolveEmbeddedDiv(config)

        if (!isVoid(config.parentDivId) &&
            !config.parentDivId.startsWith("#")) {
            config.parentDivId = "#" + config.parentDivId
        }
        if (!isVoid(config.svgId) &&
            !config.svgId.startsWith("#")) {
            config.svgId = "#" + config.svgId
        }

        recalibrateByDiv(config)

        config.innerWidth = config.width -
            config.margin.left - config.margin.right;
        config.innerHeight = config.height -
            config.margin.top - config.margin.bottom;

        if (!isVoid(config.svgId) && $(config.svgId).length > 0) {
            var svg = d3.select(config.svgId)
        } else {
            var svg = d3.select("svg")
        }

        svg
            .attr("width", config.width)
            .attr("height", config.height)
        svg.append("rect")
            .attr("width", config.width)
            .attr("height", config.height)
            .attr("fill", config.bgColor)

        // if standalone-svg div is present, make background the same color
        $("#standalone-body").css("background-color", config.bgColor)

        drawDebugCanvas(svg, config)
        drawDebugGroup(svg, config)

        var g = svg.append("g")
            .attr("transform",
                "translate(" + config.margin.left + "," +
                config.margin.top + ")")

        return {
            canvas: svg,
            svg: g,
            width: config.innerWidth,
            wid: config.innerWidth, // shorthand type 1
            w: config.innerWidth, // shorthand type 2
            height: config.innerHeight,
            hei: config.innerHeight, // shorthand type 1
            h: config.innerHeight, // shorthand type 2
            margin: config.margin,
            mar: config.margin, // shorthand type 1
            m: config.margin, // shorthand type 2
            config: config
        }
    }

    var resolveEmbeddedDiv = function(config) {
        var scriptElements = document.getElementsByTagName('script');
        if (isVoid(scriptElements) || scriptElements.length == 0) {
            return undefined;
        }
        var scriptPath = scriptElements[
            scriptElements.length - 1].src.split('/');
        if (isVoid(scriptPath) || scriptPath.length < 2) {
            return undefined;
        }
        var scriptPath = scriptPath[scriptPath.length - 2];
        var embedded = scriptElements[scriptElements.length - 1].getAttribute(
            'data-embedded') || false
        if (!embedded) {
            return
        }
        var uid = "d3wb-" + decodeURIComponent(scriptPath)
            .trim().replace(/[^a-zA-Z0-9-]/, '_')
        config.svgId = "svg-" + uid
        config.parentDivId = uid
        var dataPath = scriptElements[scriptElements.length - 1]
            .getAttribute('data-path') || undefined
        if (dataPath !== undefined) {
            setPathToData(config, dataPath)
        } else {
            setPathToData(config, scriptPath)
        }
    }

    var setPathToData = function(config, path) {
        if (config.datasrc === undefined) {
            return
        }
        if (typeof config.datasrc === 'string' ||
            config.datasrc instanceof String) {
            config.datasrc = path + "/" + config.datasrc
            return
        }
        for (var i = 0; i < config.datasrc.length; i++) {
            config.datasrc[i] = path + "/" + config.datasrc[i]
        }
    }

    var drawDebugCanvas = function(svg, config) {
        if (!config.debug) {
            return;
        }
        svg.append("rect")
            .attr("width", config.width)
            .attr("height", config.height)
            .attr("fill", d3wb.color.background.fade(20))
        svg.append("text")
            .attr("x", config.width).attr("alignment-baseline", "hanging")
            .attr("text-anchor", "end").attr("fill", d3wb.color.white)
            .text(config.width + "x" + config.height);
        svg.append("rect")
            .attr("width", config.margin.left)
            .attr("height", config.margin.top)
            .attr("fill", d3wb.color.background.fade(10))
        svg.append("text")
            .attr("font-size", "80%")
            .attr("x", config.margin.left / 2).attr("alignment-baseline", "hanging")
            .attr("text-anchor", "middle").attr("fill", d3wb.color.white)
            .text(config.margin.left);
        svg.append("text")
            .attr("font-size", "80%")
            .attr("y", config.margin.top / 2).attr("alignment-baseline", "middle")
            .attr("text-anchor", "begin").attr("fill", d3wb.color.white)
            .text(config.margin.top);
        svg.append("rect")
            .attr("x", config.width - config.margin.right)
            .attr("y", config.height - config.margin.bottom)
            .attr("width", config.margin.right)
            .attr("height", config.margin.bottom)
            .attr("fill", d3wb.color.background.fade(10))
        svg.append("text")
            .attr("font-size", "80%")
            .attr("x", config.width - config.margin.right / 2).attr("y", config.height)
            .attr("alignment-baseline", "baseline")
            .attr("text-anchor", "middle").attr("fill", d3wb.color.white)
            .text(config.margin.right);
        svg.append("text")
            .attr("font-size", "80%")
            .attr("x", config.width).attr("y",
                config.height - config.margin.bottom / 2)
            .attr("alignment-baseline", "middle")
            .attr("text-anchor", "end").attr("fill", d3wb.color.white)
            .text(config.margin.bottom);
    }

    var drawDebugGroup = function(svg, config) {
        if (!config.debug) {
            return;
        }
        var g = svg.append("g")
        g.append("rect")
            .attr("width", config.innerWidth)
            .attr("height", config.innerHeight)
            .attr("fill", d3wb.color.white.fade(30))
        g.append("text")
            .attr("x", config.innerWidth).attr("alignment-baseline", "hanging")
            .attr("text-anchor", "end").attr("fill", d3wb.color.white)
            .text(config.innerWidth + "x" + config.innerHeight);
        g.append("circle")
            .attr("cx", config.innerWidth / 2).attr("cy",
                config.innerHeight / 2)
            .attr("r", 5).attr("fill", d3wb.color.white)
        g.append("line")
            .attr("x1", 0).attr("x2", config.innerWidth / 2)
            .attr("y1", 0).attr("y2", config.innerHeight / 2)
            .attr("stroke-width", 1).attr("stroke", d3wb.color.white)
        g.append("line")
            .attr("x1", config.innerWidth).attr("x2", config.innerWidth / 2)
            .attr("y1", config.innerHeight).attr("y2", config.innerHeight / 2)
            .attr("stroke-width", 1).attr("stroke", d3wb.color.white)
        g.append("line")
            .attr("x1", config.innerWidth).attr("x2", config.innerWidth / 2)
            .attr("y1", 0).attr("y2", config.innerHeight / 2)
            .attr("stroke-width", 1).attr("stroke", d3wb.color.white)
        g.append("line")
            .attr("x1", 0).attr("x2", config.innerWidth / 2)
            .attr("y1", config.innerHeight).attr("y2", config.innerHeight / 2)
            .attr("stroke-width", 1).attr("stroke", d3wb.color.white)
        g.attr("transform",
            "translate(" + config.margin.left + "," + config.margin.top + ")")
    }

    var recalibrateByDiv = function(config) {

        // return if div id not set
        if (isVoid(config.parentDivId)) {
            return
        }
        // return if div id not found
        if ($(config.parentDivId).length != 1) {
            return
        }

        var newWid = $(config.parentDivId).width()
        if (newWid < 1) {
            newWid = config.width
        }
        var scaling = newWid / config.width
        var newHei = $(config.parentDivId).height()
        config.width = newWid
        config.height = newHei

    }

    var isVoid = function(object) {
        return (
            typeof object === "undefined" ||
            object === null ||
            object === "");
    };

    return d3wb;

})(d3, $)