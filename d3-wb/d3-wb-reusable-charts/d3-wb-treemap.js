/* exported wbTreeMap */
/**
 * Basic tree map diagram.
 * @return {Object} A reusable, updatable chart object.
 */
function wbTreeMap() {
    'use strict';

    let width = 500;
    let height = 500;
    let colors = d3.scaleOrdinal(d3.schemeCategory20c);
    let fill = 'black';

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            let treemap = d3.treemap()
                .tile(d3.treemapResquarify)
                .size([width, height])
                .round(true)
                .paddingInner(1.5);

            let root = d3.hierarchy(data)
                .eachBefore(function(d) {
                    d.data.id = (d.parent ? d.parent.data.id +
                         '.' : '') + d.data.name;
                })
                .sum(function(d) {
                    return d.size;
                })
                .sort(function(a, b) {
                    return b.height - a.height || b.value - a.value;
                });

            treemap(root);

            let cell = s.selectAll('g')
                .data(root.leaves())
                .enter().append('g')
                .attr('class', 'cells')

                .attr('transform', function(d) {
                    return 'translate(' + d.x0 + ',' + d.y0 + ')';
                });

            cell.append('rect')
                .attr('id', function(d) {
                    return d.data.id;
                })
                .attr('width', function(d) {
                    return d.x1 - d.x0;
                })
                .attr('height', function(d) {
                    return d.y1 - d.y0;
                })
                .attr('fill', function(d) {
                    return colors(d.parent.data.id);
                });

            cell.append('clipPath')
                .attr('id', function(d) {
                    return 'clip-' + d.data.id;
                })
                .append('use')
                .attr('xlink:href', function(d) {
                    return '#' + d.data.id;
                });

            cell.append('text')
                .style('font-size', '75%')
                .attr('clip-path', function(d) {
                    return 'url(#clip-' + d.data.id + ')';
                })
                .selectAll('tspan')
                .data(function(d) {
                    return d.data.name.split(/(?=[A-Z][^A-Z])/g);
                })
                .enter().append('tspan')
                .attr('x', 4)
                .attr('y', function(d, i) {
                    return 13 + i * 10;
                })
                .attr('fill', fill)
                .text(function(d) {
                    return d;
                });
        });
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.colors = function(value) {
        if (!arguments.length) return colors;
        colors = value;
        return chart;
    };

    chart.fill = function(value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    return chart;
}
