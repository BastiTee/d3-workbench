(function() {
    "use strict";

    const help = `
Usage: node d3-wb.js [-i CONTENT] [-w WORKBENCH] [-v VERSION] [-p PORT] [-r D3WBROOT]

Optional arguments:

-i CONTENT     Relativ path to content folder.
          Defaults to ./default-content
-w WORKBENCH   Alternative path to d3-workbench.
          Defaults to ./d3-wb
-s SBRES       Alternative path to d3-wb-server resources.
          Defaults to ./d3-wb-server
-p PORT        Server port.
          Defaults to 50321
-r D3WBROOT    Root path to d3-workbench.
          Defaults to current folder.
`

    // external libraries
    const express = require("express");
    const server = express();
    const fs = require("fs");
    const path = require("path");
    const parse = require("minimist")

    // argument parser
    var argv = parse(process.argv.slice(2));
    if (argv.h !== undefined) {
        console.log(help)
        process.exit(0)
    }
    argv.i = argv.i || "default-content"
    argv.p = argv.p || 50321
    argv.r = argv.r || __dirname
    argv.w = argv.w || argv.r + "/d3-wb"
    argv.s = argv.s || argv.r + "/d3-wb-server"

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    // load templates
    var fileToStr = (file) => {

        file = file.split("/")
        var filepath = argv.s
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

    var generateIndexDocument = function(requestPath, fsPath, level) {

        log("request-path:  " + requestPath);
        log("filesys-path:  " + fsPath);
        log("level:         " + level);

        var figs = ""
        var colls = ""
        var pageJson = createAndLoadInfoJson(fsPath)
        var ignore = pageJson["ignore"] || []
        var fsList = fs.readdirSync(fsPath)
        fsList.forEach(file => {
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
                `(function(){
    // add code here
})()`, "UTF-8")
        }
    }

    var createSampleContent = function(fsPath) {
        // if root folder does not exist, try to create
        try {
            fs.readdirSync(fsPath)
        } catch (error) {
            fs.mkdirSync(fsPath)
        }
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
        collections.forEach(collection => {
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
            visualizations.forEach(visualization => {
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
        return // uncomment to add logs
        message = message || ""
        console.log("/// " + message);
    }

    var uuid = function(file) {
        return "d3wb-" + file.trim().replace(/[^a-zA-Z0-9-]/, '_')
    }

    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////

    console.log("-- options: ");
    console.log(argv);

    createSampleContent(argv.i)

    // set response workflow
    server.use(setNoCache)
    server.use(serveIndexPage)

    // set static folders
    server.use("/d3_wb", express.static(argv.w))
    server.use("/res", express.static(argv.s))
    server.use(express.static(argv.i));

    // start server
    server.listen(argv.p);
    console.log("-- server started");

})()