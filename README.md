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

## Current status

This software is currently in alpha-state, but almost interface-stable. Once this is done, I'll document the interface and components in detail. Until then if you like further information, feel free to contact me at [twitter](https://twitter.com/basti_tee).

A demo d3-worbench instance can be found at <https://d3-workbench.basti.site>

## How to use the workbench

The following sections will shortly describe what you need to use d3-workbench, how to set it up and work on your visualization and how to deploy to a production system.

### Prerequisites

d3-workbench is a [node.js](https://nodejs.org/en/) framework and uses [npm](https://www.npmjs.com/), so make sure you have both installed and `npm` available on the command-line.

### Installation

Global installation as admin-user is recommended. This can be done via npm:

```
sudo -H npm install -g d3-workbench
```

Now you can run:

```
d3-workbench -h
```

to check the possible command-line options. To start d3-workbench with some sample content, run:

```
d3-workbench -i +DEMO
```

and visit <http://localhost:50321>. Use any other value for `-i` to set your own workbench folder.

### During development

While developing your prototype, it's recommended to use `browsersync`, so that your browser gets updated and reloads all the files when you save them on disk. Install it via:

`npm install -g browser-sync`

To start up d3-workbench over browsersync, start the workbench as background process:

```
d3-workbench -i my_working_folder &
```

and then proxy the workbench with browser-sync:

```
browser-sync start --proxy "localhost:50321" --files my_working_folder/*
```

## License and disclaimer

This software is licensed under [GPLv3](https://github.com/BastiTee/d3-workbench/blob/master/LICENSE).

For convenience, this software bundles the [source-code of other open-source software](https://github.com/BastiTee/d3-workbench/tree/master/d3-wb/libs). Licenses can be found in the respective subfolders.
