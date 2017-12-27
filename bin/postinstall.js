#!/usr/bin/env node
'use strict';

// external libraries
const fs = require('fs');
const path = require('path');
// change to base path
const basepath = path.join(__dirname, '..');
process.chdir(basepath);

// -----------------------------------------------------------------
console.log('TASK 1: Relink chart references to theme folders');
// -----------------------------------------------------------------

const referencePath = 'coll_00_chart_reference';

let deleteExistingLinks = function(dirname) {
    const tdir = path.join(process.cwd(),
        'default-content', dirname);
    let items = fs.readdirSync(tdir);
    for (let i = 0; i < items.length; i++) {
        let item = path.join(tdir, items[i]);
        let symbolic = fs.lstatSync(item).isSymbolicLink();
        if (symbolic) {
            console.log('- ' + path.join(dirname, items[i]));
            fs.unlinkSync(item);
        }
    }
};

let relink = function(dirname) {
    process.chdir(path.join(process.cwd(), 'default-content'));
    let items = fs.readdirSync(referencePath);
    for (let i = 0; i < items.length; i++) {
        let item = path.join(process.cwd(), referencePath, items[i]);
        let targetItem = path.join(dirname, items[i]);
        let directory = fs.lstatSync(item).isDirectory();
        if (directory) {
            let sourceLink = path.join('..', referencePath, items[i]);
            console.log('+ ' + targetItem + ' << ' + sourceLink);
            fs.symlinkSync(sourceLink, targetItem, 'dir');
        }
    }
    process.chdir(basepath);
};

deleteExistingLinks('coll_00_chart_reference_theme_2');
deleteExistingLinks('coll_00_chart_reference_theme_3');
relink('coll_00_chart_reference_theme_2');
relink('coll_00_chart_reference_theme_3');

// -----------------------------------------------------------------
