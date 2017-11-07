# d3-workbench

> A d3.js-powered workbench for rapid visualization prototyping

## In a nutshell

d3-workbench is a suite of libraries based on [d3.js](https://d3js.org) allowing for rapid prototyping of data visualizations.

It consists of three main components:

- `d3-wb`, a collection of Javascript-libraries extending [d3.js](https://d3js.org).
- `d3-wb-server`, a [node](https://nodejs.org/en/)-based server application rendering your visualizations for the browser.
- `workbench`, a working directory.

While `d3-wb` is independent from `d3-wb-server`, the latter requires `d3-wb`. All components are based on [d3.js](https://d3js.org) Version 4.

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

## How to use the workbench

The following sections will shortly describe what you need to use d3-workbench, how to set it up and work on your visualization. A running `d3-wb-server` demo instance can be found at <https://d3-workbench.basti.site>.

### Prerequisites

d3-workbench is a [node.js](https://nodejs.org/en/) framework and uses [npm](https://www.npmjs.com/), so make sure you have both installed and `npm` available on the command-line.

### Installation

Global installation as admin-user is recommended. This can be done via npm:

```
sudo npm install -g d3-workbench
```

Now you can run:

```
d3-workbench -h
```

to check the possible command-line options.

**Quick demo**: To start d3-workbench with some sample content, run `d3-workbench -i +DEMO` and visit <http://localhost:50321>.

**Work with your own content**: To start d3-workbench to work on own content, create a folder somewhere and run `d3-workbench -i /path/to/my/folder` and continue like before. Notice that `d3-wb-server` automatically creates a sample collection and visualization.

## License and further information

To get in contact with me, find me at [twitter](https://twitter.com/basti_tee).

This software is licensed under [GPLv3](https://github.com/BastiTee/d3-workbench/blob/master/LICENSE).

For convenience, this software bundles the [source-code of other open-source software](https://github.com/BastiTee/d3-workbench/tree/master/d3-wb/). Licenses can be found in the respective subfolders.

Icon made by <https://www.flaticon.com/authors/smashicons> from <https://www.flaticon.com/> is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/).
