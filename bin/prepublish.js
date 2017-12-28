const pj = require('../package.json');
const compressor = require('node-minify');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'd3-wb');
const depsPath = path.join(__dirname, '..', 'node_modules');
const trgPath = path.join(__dirname, '..', 'build', pj.version);

console.log('-- source base path: ' + srcPath);
console.log('-- exdeps base path: ' + depsPath);
console.log('-- target base path: ' + trgPath);

const cb = function(err, min) {
    if (err) {
        console.log(err);
    }
};

const bundle = function(from, to, minify) {
    minify = minify === undefined ? true : minify;
    console.log('   + bundle: ' + to);
    // Bundle only
    compressor.minify({
        compressor: 'no-compress',
        input: from,
        output: path.join(trgPath, to) + '.js',
        sync: true,
        callback: cb,
    });
    if (!minify) {
        return;
    }
    console.log('   + minify: ' + to);
    compressor.minify({
        compressor: 'gcc',
        input: from,
        output: path.join(trgPath, to) + '.min.js',
        sync: true,
        callback: cb,
    });
};

// WORKBENCH STANDALONE
bundle([
    path.join(srcPath, 'd3-wb.js'),
], 'd3-wb');
// SUBMODULES STANDALONE
bundle([
    path.join(srcPath, 'd3-wb-modules/*.js'),
], 'd3-wb-modules');
// REUSABLE CHARTS STANDALONE
bundle([
    path.join(srcPath, 'd3-wb-reusable-charts/*.js'),
], 'd3-wb-reusable-charts');
// DEPENDENCY D3 + PLUGINS (MINIFIED ONLY)
// Minify d3-cloud since it's not provided that way...
console.log('   + minify: d3.layout.cloud');
compressor.minify({
    compressor: 'uglifyjs',
    input: path.join(depsPath, 'd3-cloud', 'build/d3.layout.cloud.js'),
    output: path.join(depsPath, 'd3-cloud', 'build/d3.layout.cloud.min.js'),
    sync: true,
    callback: function(err) {
        // .. then bundle d3 including plugins
        bundle([
            path.join(depsPath, 'd3', 'build', 'd3.min.js'),
            path.join(depsPath, 'd3-cloud', 'build/d3.layout.cloud.min.js'),
            path.join(depsPath, 'd3-sankey', 'build/d3-sankey.min.js'),
            path.join(depsPath, 'd3-scale-chromatic',
                'build/d3-scale-chromatic.min.js'),
            path.join(depsPath, 'd3-svg-legend', 'd3-legend.min.js'),
            path.join(depsPath, 'd3-svg-annotation', 'd3-annotation.min.js'),
        ], 'd3-wb-exdeps.min', false);
    },
});
// FULL DISTRIBUTION
console.log('   + bundle: full distribution');
compressor.minify({
    compressor: 'no-compress',
    input: [
        path.join(trgPath, 'd3-wb-exdeps.min.js'),
        path.join(trgPath, 'd3-wb.min.js'),
        path.join(trgPath, 'd3-wb-modules.min.js'),
        path.join(trgPath, 'd3-wb-reusable-charts.min.js'),
    ],
    output: path.join(trgPath, 'd3-wb-distall.min.js'),
    sync: true,
    callback: cb,
});
