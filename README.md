# d3-workbench

> A d3.js-powered workbench for rapid visualization prototyping

## Main focus

- Rapid prototyping of data visualizations using [d3.js](https://d3js.org)
- Minimal boilerplate code for common tasks such as setting up SVGs with margin conventions, adding titles, axis, tooltips etc.
- Automatic file/folder setup for new prototypes
- Standalone fullscreen SVGs and SVG galleries out of the box
- Theme customization
- Compatibility with [d3.js](https://d3js.org) Version 4
- Compatibility with [bl.ocks.org](https://bl.ocks.org)
- Working offline
- Easy deployment via init.d and/or Docker

## Current status

This software is currently in alpha-state, but almost interface-stable. Once this is done, I'll document the interface and components in detail. Until then if you like further information, feel free to contact me at [twitter](https://twitter.com/basti_tee).

A demo d3-worbench instance can be found at <https://d3-workbench.basti.site>

## How to use the workbench

The following sections will shortly describe what you need to use d3-workbench, how to set it up and work on your visualization and how to deploy to a production system.

### Prerequisites

d3-workbench is a nodejs framework and uses npm, so your current directory should be a nodejs project. To get started from a blank file use `npm init` and answer the questions poping up.

### Installation

Installing d3-workbench is only possible from git: `npm install --save git+https://git@github.com/BastiTee/d3-workbench`

### During development

While developing your prototyp, we recommend using browsersync so that your browser gets updated and reloads all the files when you save them on disk. `npm install --save -D browser-sync` will help you.

To start up the workbench use `node node_modules/d3-workbench/d3-wb-server.js &` and `./node_modules/.bin/browser-sync start --proxy "localhost:50321" --files d3-wb-server.js d3-wb-server/* d3-wb/* default-content/*`

### Deploying

To be continued...


## License and disclaimer

This software is licensed under [GPLv3](https://github.com/BastiTee/d3-workbench/blob/master/LICENSE).

For convenience, this software bundles the [source-code of other open-source software](https://github.com/BastiTee/d3-workbench/tree/master/d3-wb/libs). Licenses can be found in the respective subfolders.
