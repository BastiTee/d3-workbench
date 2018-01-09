#!/usr/bin/env node

'use strict';

const demosymbol = '+DEMO';

// external libraries
const express = require('express');
const server = express();
const fs = require('fs');
const path = require('path');
const parse = require('minimist');
const bs = require('browser-sync').create();
const internalPort = 61426;
const pj = require('../package.json');

const showHelp = function() {
    console.log('');
    console.log('Usage:');
    console.log('');
    console.log('    node d3-wb-server.js -i WORKBENCH [OPTIONS...]');
    console.log('    npm start -- -i WORKBENCH [OPTIONS...]');
    console.log('');
    console.log('    -i WORKBENCH    Path to your workbench folder.' +
        ' Use +DEMO for example content.');
    console.log('');
    console.log('Optional arguments:');
    console.log('');
    console.log('    -p PORT         Server port. Defaults to 50321.');
    console.log('    -n              Disable hot-reload via browser-sync.');
    console.log('    -v              Verbose output.');
};

// argument parser
const argv = parse(process.argv.slice(2));
if (argv.h !== undefined) {
    showHelp();
    process.exit(0);
}
if (argv.i === undefined || argv.i == true || argv.i == false) {
    console.log('No workbench/working folder provided!');
    showHelp();
    process.exit(0);
}
// check if demo content was requested
if (argv.i === demosymbol) {
    argv.i = path.resolve(__dirname + '/../default-content');
}
argv.i = path.resolve(argv.i);
try {
    fs.readdirSync(argv.i);
} catch (error) {
    console.log(
        'Provided workbench/working ' + argv.i + ' folder does not exist!');
    showHelp();
    process.exit(0);
}
argv.p = argv.p || 50321;

// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////

const fileToStr = function(file) {
    file = file.split('/');
    let filepath = path.resolve(__dirname + '/../d3-wb-server');
    for (let i = 0; i < file.length; i++) {
        filepath = path.join(filepath, file[i]);
    }
    return fs.readFileSync(filepath, 'utf8');
};

const ignored = function(ignore, file) {
    for (let i in ignore) {
        if (file === ignore[i]) {
            return true;
        }
    }
    return false;
};

const compareVersions = function(folder) {
    let localVersion;
    let versionFile = path.join(folder, 'd3-wb-version');
    try {
        localVersion = fs.readFileSync(versionFile, 'utf8');
    } catch (error) {
        // version file not present
        fs.writeFileSync(versionFile, pj.version, 'utf8');
        return;
    }
    localVersion = localVersion.trim();
    if (localVersion != pj.version) {
        console.error('WARNING: You are running d3-workbench version ' +
            pj.version + ', but workbench was created using version ' +
            localVersion + '. This might lead to broken visualizations.');
    }
};

const generateIndexDocument = function(requestPath, fsPath, level) {
    log('request-path:  ' + requestPath);
    log('filesys-path:  ' + fsPath);
    log('level:         ' + level);

    let figs = '';
    let colls = '';
    let pageJson = createAndLoadInfoJson(fsPath);
    let ignore = pageJson['ignore'] || [];
    let fsList = fs.readdirSync(fsPath);
    fsList.forEach(function(file) {
        if (ignored(ignore, file)) {
            return;
        }
        let absPath = path.resolve(fsPath, file);
        if (fs.lstatSync(absPath).isFile()) {
            return;
        }
        if (level == 1) {
            // Search for subfolders acting as collection folders
            const json = createAndLoadInfoJson(absPath);
            let coll = fileToStr('templates/template-collection.html')
                .replace(/#FILE#/g, file).replace(/#TITLE#/g, json.title);
            colls = colls + coll + '\n';
        } else if (level == 2) {
            // Search for subfolders acting as visualization folders
            const json = createAndLoadInfoJson(absPath);
            json.height = json.height || 500;
            let fig = fileToStr('templates/template-figure.html')
                .replace(/#TITLE#/g, json.title)
                .replace(/#ID#/g, uuid(file))
                .replace(/#FILE#/g, file)
                .replace(/#HEIGHT#/g, json.height);
            figs = figs + fig + '\n';
        }
    });

    let template = fileToStr('index-collection.html');
    let indexDoc = template
        .replace(/#LINKS#/g, figs)
        .replace(/#COLLS#/g, colls)
        .replace(/#PAGE#/g, pageJson.title);
    if (level == 1) {
        indexDoc = indexDoc.replace(/\.\.\/res\//g, './res/');
    }
    return indexDoc;
};

const isContentFolder = function(requestPath) {
    let fsPath = path.join(argv.i, requestPath).replace('%20', ' ');
    try {
        if (fs.lstatSync(fsPath).isDirectory()) {
            log('### content ### ' + requestPath);
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
};

const getSubDirs = function(fsPath) {
    return fs.readdirSync(fsPath).filter(function(f) {
        return fs.lstatSync(path.join(fsPath, f)).isDirectory() ||
            fs.lstatSync(path.join(fsPath, f)).isSymbolicLink();
    });
};

const createAndLoadInfoJson = function(fsPath) {
    let jsonFilepath = path.join(fsPath, 'info.json');
    try {
        let infoJson = fs.readFileSync(jsonFilepath, 'utf8');
        const json = JSON.parse(infoJson);
        json.error = '';
        return json;
    } catch (error) {
        // obtain folder name
        fsPath = fsPath || '?';
        fsPath = fsPath.replace(/\/+$/, '').replace(/.*\//, '');
        // create json
        const json = {
            'title': fsPath,
        };
        // write json
        fs.writeFileSync(jsonFilepath, JSON.stringify(
            json, null, 4), 'utf8');
        // done
        return json;
    }
};

const createLocalCss = function(fsPath, level) {
    try {
        fs.readFileSync(fsPath + '/local.css');
    } catch (error) {
        fs.writeFileSync(fsPath + '/local.css',
            fileToStr('templates/template-local.css'), 'UTF-8');
    }
};

const createLocalJs = function(fsPath, level) {
    try {
        fs.readFileSync(fsPath + '/local.js');
    } catch (error) {
        fs.writeFileSync(fsPath + '/local.js',
            '(function() {\n    // add code here\n})();\n', 'UTF-8');
    }
};

const createSampleContent = function(fsPath) {
    log('-- setting up content at: ' + fsPath);
    // info.json and local.css for root folder
    createAndLoadInfoJson(fsPath);
    createLocalCss(fsPath);
    createLocalJs(fsPath);
    // handle collection folders
    let collections = getSubDirs(fsPath);
    // if no collections exist create one
    if (collections.length == 0) {
        fs.mkdirSync(path.join(fsPath, 'collection'));
        collections = getSubDirs(fsPath);
    }
    collections.forEach(function(collection) {
        collection = path.join(fsPath, collection);
        // info.json and local.css for collection folder
        createAndLoadInfoJson(collection);
        createLocalCss(collection);
        createLocalJs(collection);
        // handle viz folders
        let visualizations = getSubDirs(collection);
        // if no visualization exist create one
        if (visualizations.length == 0) {
            fs.mkdirSync(path.join(collection, 'visualization'));
            visualizations = getSubDirs(collection);
        }
        visualizations.forEach(function(visualization) {
            visualization = path.join(collection, visualization);
            createAndLoadInfoJson(visualization);
            createTemplateVisualization(visualization);
        });
    });
};

const createTemplateVisualization = function(fsPath) {
    let fsList = fs.readdirSync(fsPath).filter(function(el) {
        return el != 'info.json';
    });
    if (fsList.length == 0) {
        fs.writeFileSync(path.join(fsPath, 'svg.js'),
            fileToStr('templates/template-svg.js'), 'UTF-8');
        fs.writeFileSync(path.join(fsPath, 'data.csv'),
            fileToStr('templates/template-data.csv'), 'UTF-8');
    }
};

// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////

const normalizeRequestPath = function(requestPath) {
    return requestPath.replace('index.html', '');
};

const setNoCache = function(request, response, next) {
    response.header('Cache-Control',
        'private, no-cache, no-store, must-revalidate');
    response.header('Expires', '-1');
    response.header('Pragma', 'no-cache');
    next();
};

const serveIndexPage = function(request, response, next) {
    let requestPath = normalizeRequestPath(request.path);
    let fsPath = path.join(argv.i, requestPath).replace('%20', ' ');
    let level = requestPath.split('/').length - 1;

    if (isContentFolder(requestPath)) {
        createSampleContent(argv.i);
    }

    if (isContentFolder(requestPath) && level <= 2) {
        // on root folder or collection folders autogenerate an index
        response.writeHead(200, {
            'Content-Type': 'text/html',
        });
        response.write(generateIndexDocument(requestPath, fsPath, level));
        response.end();
    } else if (isContentFolder(requestPath) && level == 3) {
        response.writeHead(200, {
            'Content-Type': 'text/html',
        });
        let template;
        try {
            // if there is a manual index, return it...
            template = fs.readFileSync(path.join(fsPath, 'index.html'));
        } catch (error) {
            // otherwise generate it
            template = fileToStr('index-canvas.html');
        }
        response.write(template);
        response.end();
    } else {
        next();
    }
};

// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////

const log = function(message) {
    if (!argv.v) {
        return;
    }
    message = message || '';
    console.log('/// ' + message);
};

const uuid = function(file) {
    return 'd3wb-' + file.trim().replace(/[^a-zA-Z0-9-]/, '_');
};

// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////

compareVersions(argv.i);

log('-- options: ');
log(argv);

createSampleContent(argv.i);

// set response workflow
server.use(setNoCache);
server.use(serveIndexPage);

// set static folders
server.use('/d3_wb',
    express.static(path.resolve(__dirname + '/../d3-wb')));
server.use('/libs',
    express.static(path.resolve(__dirname + '/../node_modules')));
server.use('/res',
    express.static(path.resolve(__dirname + '/../d3-wb-server')));
server.use(
    express.static(argv.i));

// start server
if (argv.n) {
    server.listen(argv.p);
} else {
    server.listen(internalPort);

    // create browsersync proxy
    const watchFolder = argv.i + '/**/*';
    log('Watching files in ' + watchFolder);
    bs.watch(watchFolder)
        .on('change', bs.reload);
    bs.watch(path.resolve(__dirname + '/../d3-wb') + '/**/*')
        .on('change', bs.reload);
    bs.init({
        proxy: 'http://localhost:' + internalPort,
        port: argv.p,
        ui: false,
        notify: false,
        logLevel: argv.v ? 'info' : 'silent',
    });
}

log('>> http://localhost:' + argv.p + ' << ' + argv.i);
