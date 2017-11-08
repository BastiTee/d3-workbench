# d3-workbench

## In a nutshell

d3-workbench helps you to rapidly create data visualization prototypes using [d3.js v4](https://d3js.org).

It consists of three main components:

- `d3-wb`, a collection of Javascript-libraries and plugins extending [d3.js](https://d3js.org).
- `d3-wb-server`, a local application rendering visualizations in your browser while you develop.
- `workbench`, your working directory.

All components are based on [d3.js](https://d3js.org) Version 4.

## Quick start

d3-workbench uses [node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/). Make sure you have both installed and `npm` available on the command-line.

As admin run

```
npm install -g d3-workbench
d3-workbench -i +DEMO
```

A browser window will open and display a demo workbench. To start with your own project, create a new folder somewhere and run

```
d3-workbench -i /path/to/myfolder
```

Instead of the demo workbench, an empty workbench is created, providing you with a new collection containing a sample visualization.

## Components

### d3-wb

`d3-wb` loosely bundles the following components:

- [`d3-wb.js`](d3-wb/d3-wb.js): The core component that minimizes boilerplate code for common tasks such as setting up SVGs with margin conventions, handling data paths, resizing SVGs to parent DIVs, etc.
- [`d3-wb-plugins`](d3-wb/d3-wb-plugins): A set of plug-ins to speed up visualization by providing utilities for recurring tasks such as adding titles, axis, tool-tips or HTML-components, changing color themes and working with data.
- [`d3-wb-reusable-charts`](d3-wb/d3-wb-reusable-charts): A collection of basic charts such as bar, line, scatter or donut charts. All charts are designed to be fully reusable (in the spirit of [«Towards Reusable Charts»](https://bost.ocks.org/mike/chart/) and [«Towards Updatable D3.js Charts»](https://www.toptal.com/d3-js/towards-reusable-d3-js-charts)) and can be used independently from d3-workbench.
- [`d3-plugins`](d3-wb/d3-plugins): External d3-plugins that are required for some of the reusable charts.
- [`d3`](d3-wb/d3): The heart and soul of everything; a static version of [d3.js](https://d3js.org) Version 4.

A [library release](https://bastitee.github.io/d3-workbench-ghp/) of those components provides different combinations of the above components, depending on what you require.

### d3-wb-server

`d3-wb-server` is an engine, that supports you to manage and create your data visualization prototypes. Currently two levels exist: Collections and visualizations where the latter is part of a collection.

`d3-wb-server` takes care of..

- Assembling and rendering of your local files into a browser-based collection/visualization viewer
- Automatic lookup and setup of local files/folders
- Auto-reload of the browser if you change a file in your workbench
- Standalone fullscreen SVGs and SVG galleries out of the box
- Offline-work

### workbench

`workbench` is a local folder that contains your collections and visualizations. Shipped with d3-workbench comes a [workbench](default-content) that demonstrates all the reusable charts and libraries.

On top-level you will find your collections (in the example a collection of [chart examples](default-content/coll_00_chart_reference) and [utility examples](default-content/coll_01_tech_specs)).

Inside a collection you will find one folder for each of the collection's visualizations, e.g., an [example implementation](default-content/coll_00_chart_reference/002-barchart) of the reusable bar chart.

## Workflow

### Start visualizing

_TODO_

### Share collections

_TODO_

### Self-host your collections online

_TODO_

### Integrate visualizations in other websites

_TODO_

## License and further information

This software is licensed under [GPLv3](https://github.com/BastiTee/d3-workbench/blob/master/LICENSE).

For convenience, this software bundles the [source-code of other open-source software](https://github.com/BastiTee/d3-workbench/tree/master/d3-wb/). Licenses can be found in the respective subfolders.

Icon made by <https://www.flaticon.com/authors/smashicons> from <https://www.flaticon.com/> is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/).

You can get in contact with me via my [hub-page](https://basti.site).
