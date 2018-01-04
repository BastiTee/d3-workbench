(function() {

    // programmatically create a custom theme
    const customColors = {
        background: '#ffffff',
        black: '#000000',
        blue: '#afafaf',
        cyan: '#cdcdcd',
        foreground: '#222222',
        green: '#bfbfbf',
        magenta: '#cecece',
        red: '#a1a1a1',
        white: '#eeeeee',
        yellow: '#e5e5e5',
    };
    d3wb.theme.add('custom-bw', customColors);

    // define constant chart values
    const cv = d3wb.config().toCanvas();
    const themes = d3wb.themes;
    const data = d3wb.theme();

    const width = (cv.wid * 0.9) / data.length;
    const widthPad = (cv.wid * 0.1) / data.length - 1;
    const height = cv.hei * 0.8;
    const btHeight = cv.hei * 0.1;
    const btPad = btHeight * 0.1
    const labHeight = cv.hei * 0.1;

    // create static SVG elements
    const background = cv.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', cv.wid)
        .attr('height', cv.hei)

    const boxes = cv.selectAll('.color-element')
        .data(data).enter().append('rect')
        .attr('class', 'color-element')
        .attr('x', function(d, i) {
            return widthPad + (widthPad + width) * i;
        })
        .attr('y', btHeight)
        .attr('height', height)
        .attr('width', width)
        .attr('stroke-width', 1)

    const labels = cv.selectAll('.text-element')
        .data(data).enter().append('text')
        .attr('class', 'text-element')
        .attr('x', function(d, i) {
            return width / 2 + widthPad + (widthPad + width) * i;
        })
        .attr('y', btHeight + height + 5)
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle')
        .style('-moz-user-select', 'none')
        .style('user-select', 'none')
        .text(function(d) {
            return d;
        })

    // define update-function for theme changes
    const update = function() {
        background.attr('fill', d3wb.color.background)
        boxes
            .attr('fill', function(d, i) {
                return d3wb.color[d];
            })
            .attr('stroke', function(d) {
                return d3wb.color.foreground;
            });
        labels
            .attr('fill', function(d, i) {
                return d3wb.color.foreground;
            })
    }

    // add a control to invoke theme change
    var bt = d3wb.html.dropdown()
        .options(themes)
        .style('top', btPad + 'px')
        .style('left', widthPad + 'px')
        .style('width', (width * 1.5 + widthPad) + 'px')
        .style('height', Math.min(btHeight - btPad * 2, 30) + 'px')
        .callback(function(val) {
            d3wb.theme(val);
            update();
        });
    cv.call(bt)

})()
