/* exported wbSankeyDiagram */
/**
 * Classic sankey diagram.
 * @return {Object} A reusable, updatable chart object.
 */
function wbSankeyDiagram() {
    'use strict';

    let width = 500;
    let height = 500;
    let fill = 'black';
    let colors = d3.scaleOrdinal(d3.schemeCategory20c);

    let chart = function(selection) {
        selection.each(function(data, i, nodes) {
            let s = d3.select(nodes[i]);

            let sankey = d3.sankey()
                .nodeWidth(15)
                .nodePadding(10)
                .size([width, height]);

            sankey(data);

            s.append('g')
                .attr('class', 'sankey-link')
                .style('fill', 'none')
                .style('stroke', fill)
                .style('stroke-opacity', .2)
                .selectAll('path')
                .data(data.links)
                .enter().append('path')
                .attr('d', d3.sankeyLinkHorizontal())
                .attr('stroke-width', function(d) {
                    return Math.max(1, d.width);
                });

            let node = s.append('g')
                .attr('class', 'sankey-node')
                .selectAll('g')
                .data(data.nodes)
                .enter().append('g');

            node.append('rect')
                .attr('x', function(d) {
                    return d.x0;
                })
                .attr('y', function(d) {
                    return d.y0;
                })
                .attr('height', function(d) {
                    return d.y1 - d.y0;
                })
                .attr('width', function(d) {
                    return d.x1 - d.x0;
                })
                .attr('fill', function(d) {
                    return colors(d.name.replace(/ .*/, ''));
                })
                .style('stroke', function(d) {
                    return fill;
                });

            node.append('text')
                .style('fill', function(d) {
                    return fill;
                })
                .attr('x', function(d) {
                    return d.x0 - 6;
                })
                .attr('y', function(d) {
                    return (d.y1 + d.y0) / 2;
                })
                .attr('text-anchor', 'end')
                .text(function(d) {
                    return d.name;
                })
                .filter(function(d) {
                    return d.x0 < width / 2;
                })
                .attr('x', function(d) {
                    return d.x1 + 6;
                })
                .attr('text-anchor', 'start');
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

    chart.fill = function(value) {
        if (!arguments.length) return fill;
        fill = value;
        return chart;
    };

    chart.colors = function(value) {
        if (!arguments.length) return colors;
        colors = value;
        return chart;
    };

    return chart;
};
