#!/usr/bin/env node

"use strict";

var demosymbol = "+DEMO"
var help = "\n\
Usage:\n\
\n\
    node d3-wb-server.js -i WORKBENCH [OPTIONS...]\n\
    npm start -- -i WORKBENCH [OPTIONS...]\n\
\n\
    -i WORKBENCH    Path to your workbench folder. Use +DEMO for example content.\n\
\n\
Optional arguments:\n\
\n\
    -p PORT         Server port. Defaults to 50321.\n\
    -n              Disable hot-reload via browser-sync.\n\
    -v              Verbose output.\n\
"

// external libraries
var express = require("express");
var server = express();
var fs = require("fs");
var path = require("path");
var parse = require("minimist")
var bs = require("browser-sync").create();
var internalPort = 61426
var pj = require('../package.json');

// argument parser
var argv = parse(process.argv.slice(2));
if (argv.h !== undefined) {
    console.log(help)
    process.exit(0)
}
if (argv.i === undefined || argv.i == true || argv.i == false) {
    console.log("No workbench/working folder provided!");
    console.log(help)
    process.exit(0)
}
// check if demo content was requested
if (argv.i === demosymbol) {
    argv.i = path.resolve(__dirname + "/../default-content")
}
argv.i = path.resolve(argv.i)
try {
    fs.readdirSync(argv.i)
} catch (error) {
    console.log("Provided workbench/working " + argv.i + " folder does not exist!");
    console.log(help)
    process.exit(0)
}
argv.p = argv.p || 50321

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

var fileToStr = function(file) {

    file = file.split("/")
    var filepath = path.resolve(__dirname + "/../d3-wb-server")
    for (var i in file) {
        filepath = path.join(filepath, file[i])
    }
    return fs.readFileSync(filepath, "utf8")
}

var ignored = function(ignore, file) {
    for (var i in ignore) {
        if (file === ignore[i]) {
            return true;
        }
    }
    return false;
}

var compareVersions = function(folder) {
    var localVersion;
    var versionFile = path.join(folder, "d3-wb-version")
    try {
        localVersion = fs.readFileSync(versionFile, "utf8")
    } catch (error) {
        // version file not present
        fs.writeFileSync(versionFile, pj.version, "utf8")
        return
    }
    if (localVersion != pj.version) {
        console.error("WARNING: You are running d3-workbench version " +
            pj.version + ", but workbench was created using version " +
            localVersion + ". This might lead to broken visualizations.")
    }
}

var generateIndexDocument = function(requestPath, fsPath, level) {

    log("request-path:  " + requestPath);
    log("filesys-path:  " + fsPath);
    log("level:         " + level);

    var figs = ""
    var colls = ""
    var pageJson = createAndLoadInfoJson(fsPath)
    var ignore = pageJson["ignore"] || []
    var fsList = fs.readdirSync(fsPath)
    fsList.forEach(function(file) {
        if (ignored(ignore, file)) {
            return
        }
        var absPath = path.resolve(fsPath, file)
        if (fs.lstatSync(absPath).isFile()) {
            return
        }
        if (level == 1) {
            // Search for subfolders acting as collection folders
            var json = createAndLoadInfoJson(absPath)
            var coll = fileToStr("templates/template-collection.html")
                .replace(/#FILE#/g, file).replace(/#TITLE#/g, json.title)
            colls = colls + coll + "\n"
        } else if (level == 2) {
            // Search for subfolders acting as visualization folders
            var json = {}
            var json = createAndLoadInfoJson(absPath)
            json.height = json.height || 500
            var fig = fileToStr("templates/template-figure.html")
                .replace(/#TITLE#/g, json.title)
                .replace(/#ID#/g, uuid(file))
                .replace(/#FILE#/g, file)
                .replace(/#HEIGHT#/g, json.height)
            figs = figs + fig + "\n"
        }
    });

    var template = fileToStr("index-collection.html")
    var indexDoc = template
        .replace(/#LINKS#/g, figs)
        .replace(/#COLLS#/g, colls)
        .replace(/#PAGE#/g, pageJson.title)
    if (level == 1) {
        indexDoc = indexDoc.replace(/\.\.\/res\//g, "./res/")
    }
    return indexDoc
}

var isContentFolder = function(requestPath) {
    var fsPath = path.join(argv.i, requestPath).replace("%20", " ")
    try {
        if (fs.lstatSync(fsPath).isDirectory()) {
            log("### content ### " + requestPath)
            return true
        }
    } catch (error) {
        return false
    }
    return false
}

var getSubDirs = function(fsPath) {
    return fs.readdirSync(fsPath).filter(function(f) {
        return fs.lstatSync(path.join(fsPath, f)).isDirectory() ||
            fs.lstatSync(path.join(fsPath, f)).isSymbolicLink()
    })
}

var createAndLoadInfoJson = function(fsPath) {
    var jsonFilepath = path.join(fsPath, "info.json")
    try {
        var infoJson = fs.readFileSync(jsonFilepath, "utf8")
        var json = JSON.parse(infoJson)
        json.error = ""
        return json;
    } catch (error) {
        // obtain folder name
        fsPath = fsPath || "?"
        fsPath = fsPath.replace(/\/+$/, "").replace(/.*\//, "")
        // create json
        var json = {
            "title": fsPath
        }
        // write json
        fs.writeFileSync(jsonFilepath, JSON.stringify(
            json, null, 4), "utf8")
        // done
        return json
    }
}

var createLocalCss = function(fsPath, level) {
    try {
        fs.readFileSync(fsPath + "/local.css")
    } catch (error) {
        fs.writeFileSync(fsPath + "/local.css",
            fileToStr("templates/template-local.css"), "UTF-8")
    }
}

var createLocalJs = function(fsPath, level) {
    try {
        fs.readFileSync(fsPath + "/local.js")
    } catch (error) {
        fs.writeFileSync(fsPath + "/local.js",
            "(function(){\n// add code here\n})()", "UTF-8")
    }
}

var createSampleContent = function(fsPath) {
    log("-- setting up content at: " + fsPath);
    // info.json and local.css for root folder
    createAndLoadInfoJson(fsPath)
    createLocalCss(fsPath)
    createLocalJs(fsPath)
    // handle collection folders
    var collections = getSubDirs(fsPath)
    // if no collections exist create one
    if (collections.length == 0) {
        fs.mkdirSync(path.join(fsPath, "collection"))
        var collections = getSubDirs(fsPath)
    }
    collections.forEach(function(collection) {
        collection = path.join(fsPath, collection)
        // info.json and local.css for collection folder
        createAndLoadInfoJson(collection)
        createLocalCss(collection)
        createLocalJs(collection)
        // handle viz folders
        var visualizations = getSubDirs(collection)
        // if no visualization exist create one
        if (visualizations.length == 0) {
            fs.mkdirSync(path.join(collection, "visualization"))
            var visualizations = getSubDirs(collection)
        }
        visualizations.forEach(function(visualization) {
            visualization = path.join(collection, visualization)
            createAndLoadInfoJson(visualization)
            createTemplateVisualization(visualization)
        })
    })
}

var createTemplateVisualization = function(fsPath) {
    var fsList = fs.readdirSync(fsPath).filter(function(el) {
        return el != "info.json"
    })
    if (fsList.length == 0) {
        fs.writeFileSync(path.join(fsPath, "svg.js"),
            fileToStr("templates/template-svg.js"), "UTF-8")
        fs.writeFileSync(path.join(fsPath, "data.csv"),
            fileToStr("templates/template-data.csv"), "UTF-8")
    }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

var normalizeRequestPath = function(requestPath) {
    return requestPath.replace("index.html", "")
}

var setNoCache = function(request, response, next) {
    response.header("Cache-Control",
        "private, no-cache, no-store, must-revalidate");
    response.header("Expires", "-1");
    response.header("Pragma", "no-cache");
    next();
}

var serveIndexPage = function(request, response, next) {
    var requestPath = normalizeRequestPath(request.path)
    var fsPath = path.join(argv.i, requestPath).replace("%20", " ")
    var level = requestPath.split("/").length - 1

    if (isContentFolder(requestPath)) {
        createSampleContent(argv.i)
    }

    if (isContentFolder(requestPath) && level <= 2) {
        // on root folder or collection folders autogenerate an index
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        response.write(generateIndexDocument(requestPath, fsPath, level));
        response.end();
    } else if (isContentFolder(requestPath) && level == 3) {
        response.writeHead(200, {
            "Content-Type": "text/html"
        });
        try {
            // if there is a manual index, return it...
            var template = fs.readFileSync(path.join(fsPath, "index.html"));
        } catch (error) {
            // otherwise generate it
            var template = fileToStr("index-canvas.html")
        }
        response.write(template);
        response.end();
    } else {
        next()
    }
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

var log = function(message) {
    if (!argv.v) {
        return
    }
    message = message || ""
    console.log("/// " + message);
}

var uuid = function(file) {
    return "d3wb-" + file.trim().replace(/[^a-zA-Z0-9-]/, "_")
}

//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

compareVersions(argv.i)

log("-- options: ");
log(argv);

createSampleContent(argv.i)

// set response workflow
server.use(setNoCache)
server.use(serveIndexPage)

// set static folders
server.use("/d3_wb", express.static(path.resolve(__dirname + "/../d3-wb")))
server.use("/libs", express.static(path.resolve(__dirname + "/../node_modules")))
server.use("/res", express.static(path.resolve(__dirname + "/../d3-wb-server")))
server.use(express.static(argv.i));

// start server
if (argv.n) {

    server.listen(argv.p);

} else {

    server.listen(internalPort);

    // create browsersync proxy
    var watchFolder = argv.i + "/**/*"
    log("Watching files in " + watchFolder)
    bs.watch(watchFolder).on("change", bs.reload);
    bs.watch(path.resolve(__dirname + "/../d3-wb") + "/**/*")
        .on("change", bs.reload);
    bs.init({
        proxy: "http://localhost:" + internalPort,
        port: argv.p,
        ui: false,
        notify: false,
        logLevel: argv.v ? "info" : "silent"
    });
}

log(">> http://localhost:" + argv.p + " << " + argv.i);