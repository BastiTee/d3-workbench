![header-image](d3-wb-server/gfx/header.png)

[![GitHub release](https://img.shields.io/github/release/BastiTee/d3-workbench.svg)](https://github.com/BastiTee/d3-workbench/releases/latest) [![Demo Online](https://img.shields.io/badge/watch-demo-green.svg)](https://d3-workbench.basti.site/)

# In a nutshell

d3-workbench helps you to quickly create data visualization prototypes with [d3.js](https://d3js.org).

It consists of three main components:

- `d3-wb`, a collection of Javascript-libraries and plugins extending [d3.js](https://d3js.org).
- `d3-wb-server`, a local application rendering visualizations in your browser while you develop.
- `workbench`, your working directory.

d3-workbench is not a framework, even though it offers libraries with strict APIs. It's neither required to use any of the utilities, reusable charts or plugins (e.g., if you just want to benefit from the server component), nor is your data visualization bound to a d3-workbench environment.

Think of d3-workbench as a distribution as in «Linux distribution» with [d3.js](https://d3js.org) being the kernel.

All components are [d3.js V4-ready](https://github.com/d3/d3/blob/master/CHANGES.md).

# Quick start

d3-workbench uses [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/). Make sure you have both installed and `npm` available on the command-line.

As admin install by executing

```shell
npm install -g d3-workbench
```

and to start as regular user

```shell
d3-workbench -i +DEMO
```

A browser window will open and display a demo workbench. To start with your own project, create a new folder somewhere and run

```shell
d3-workbench -i /path/to/myfolder
```

Instead of the demo workbench, an empty workbench is created, providing you with a new collection containing a sample visualization to start with.

To start d3-workbench from source, use the `start` script

```shell
npm start -- -i /path/to/myfolder -v
```

Notice the `--` otherwise the remaining options are considered `npm` options.

To start d3-workbench through docker, you can build from the provided Dockerfile

```shell
docker build -t d3-workbench .
docker run -ti --rm -p 50321:50321 d3-workbench
```

# Components

## d3-wb

`d3-wb` consists of the following components:

- [`d3-wb.js`](d3-wb/d3-wb.js): The core component that minimizes boilerplate code for common tasks such as setting up SVGs with margin conventions, handling data paths, resizing SVGs to parent DIVs, etc.
- [`d3-wb-modules/`](d3-wb/d3-wb-modules): A set of modules to speed up visualization by providing utilities for recurring tasks such as adding titles, axis, tool-tips or HTML-components, changing color themes and working with data. These modules require [`d3-wb.js`](d3-wb/d3-wb.js) to be loaded first.
- [`d3-wb-reusable-charts/`](d3-wb/d3-wb-reusable-charts): A collection of basic charts such as bar, line, scatter or donut charts. All charts are designed to be fully reusable (in the spirit of [«Towards Reusable Charts»](https://bost.ocks.org/mike/chart/) and [«Towards Updatable D3.js Charts»](https://www.toptal.com/d3-js/towards-reusable-d3-js-charts)), can be used independently from d3-workbench and don't require [`d3-wb.js`](d3-wb/d3-wb.js).

[Library releases](https://bastitee.github.io/d3-workbench-ghp/) of different combinations of these components are available depending on your needs.

## d3-wb-server

`d3-wb-server` is an engine, that helps you to manage and create your data visualization prototypes. `d3-wb-server` takes care of..

- Assembling and rendering of your local files into a browser-based collection/visualization viewer
- Automatic lookup and setup of local files/folders
- Auto-reload of the browser if you change a file in your workbench
- Standalone fullscreen SVGs and SVG galleries out of the box
- Offline-work

## workbench

`workbench` is a local folder that contains your visualization work in progress. Shipped with d3-workbench comes a [workbench](default-content) that demonstrates all the reusable charts and libraries. Your work is organized in collections.

In your workbench's top-level you will find your collections (in the example a collection of [chart examples](default-content/coll_00_chart_reference) and [utility examples](default-content/coll_01_tech_specs)).

Inside a collection you will find one folder for each of the collection's visualizations, e.g., an [example implementation](default-content/coll_00_chart_reference/d3-wb-barchart) of the reusable bar chart.

The overall file/folder structure for your `workbench`:

```
<workbench>
  |-- d3-wb-version      - Stores the d3-workbench version that created this workbench
  |-- info.json          - A file to configure the top-level webpage
  |-- local.css          - A local CSS file to change the appearance of the top-level webpage
  |-- local.cs           - A local JS file to be executed if the top-level webpage is requested
  |-- collection_1/      - A subfolder, i.e. a collection of visualizations
      |-- info.json      - Like above, but applied to the current collection
      |-- local.css      - Like above, but applied to the current collection
      |-- local.js       - Like above, but applied to the current collection
      |-- viz_1/         - A visualization
          |-- info.json  - Like above, but applied to the current visualization
          |-- data.csv   - A file containing the data for this visualization
          |-- svg.js     - The implementation file for this visualization
  |-- collection_2/      ...
```

The `info.json` file currently supports the following options:

**Option** | **Explanation**
---------- | -------------------------------------------------------------
title      | Title of the current (sub-) page
isroot     | Mark the current folder as root folder (deprecated)
height     | Desired visualization height (only applied to visualizations)
ignore     | A list of sub-folders to be ignored

# Workflow

Below you find some information on a typical workflow using d3-workbench.

## Start visualizing

In the beginning you probably use d3-workbench as described above. After you've installed the application, you create a new `workbench` and create collections and visualizations.

Consider the [default workbench](default-content) as an up-to-date cookbook for all things possible with d3-workbench. For example if you want to create a sankey diagram yourself, checkout the [visualization](default-content/coll_00_chart_reference/d3-wb-sankey) code, especially the necessary [data format](default-content/coll_00_chart_reference/d3-wb-sankey/data.json) and the [javascript-code](default-content/coll_00_chart_reference/d3-wb-sankey/svg.js).

## Share collections

`workbench` folders have no external dependencies except for d3-workbench available on the command line. If you want to share your collections, you can simple ZIP-compress your `workbench` and send it to someone. Or you might put your `workbench` on GitHub and work collaboratively. Notice that each `workbench` contains a [version-file](default-content/d3-wb-version) indicating the d3-workbench version it was created with.

## Integrate visualizations in other websites

As long as you haven't introduced any new dependencies, you can include the [library components of d3-workbench](#d3-wb) into [bl.ocks](https://bl.ocks.org/) or your own website. There is an example [bl.ock](https://bl.ocks.org/BastiTee/84675415bfbcaebbf5397e645a26b706)/[gist](https://gist.github.com/BastiTee/84675415bfbcaebbf5397e645a26b706) where you can see how it's applied. Inside the running demo instance you will find another [example](default-content/coll_00_chart_reference/000-index-manual/index.html) under the path [coll_01_tech_specs/000-index-manual/](http://localhost:50321/coll_01_tech_specs/000-index-manual/).

To auto-scale your visualization to a surrounding `div` you would use a code snippet like this:

```html
<!-- Define a unique ID for the DIV containing the visualization
     and optional a class to style it, e.g., the desired
     width and height. -->
<div id="figure" class="figures">
    <!-- Add an empty SVG body with a unique SVG ID. -->
    <svg id="svg-figure"></svg>
    <!-- Reference your d3 script..
         - embedded: set to true so d3wb will look for the surrounding DIV
         - datapath: relative path to where your data is stored
         - svgid: ID of your SVG element
         - divid: ID of your surrounding DIV element
    -->
    <script src="svg.js"
        embedded="true"
        datapath="."
        svgid="svg-figure"
        divid="figure" ></script>
</div>
```

## Self-host your collections online

Of course you can simple put a web server in front of a running d3-workbench instance and host your work from there. There is a demo instance using this particular method available at <https://d3-workbench.basti.site/>.

In this case a simple Apache-based URL-Rewrite was used:

```
RewriteEngine On
RewriteRule ^(.*)$ http://localhost:50321/$1 [P]
```

# License and further information

This software is licensed under [GPLv3](https://github.com/BastiTee/d3-workbench/blob/master/LICENSE).

Icon made by <https://www.flaticon.com/authors/smashicons> from <https://www.flaticon.com/> is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/).

Even though the overall interfaces are stable, so you can safely work with d3-workbench, the project is still evolving and there is a ton of things still to do. This includes. Contributions and beta-testers are always welcome. You can get in contact with me via my [hub-page](https://basti.site).
