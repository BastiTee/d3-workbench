(function() {
    let cv = d3wb.config()
        .data(['de-federal-states.json', 'data.csv'])
        .toCanvas();

    d3.queue()
        .defer(d3.json, cv.data[0])
        .defer(d3.csv, cv.data[1])
        .await(function(error, mapData, infoData) {
            // only datasets with lat/lon set
            infoData = infoData.filter(function(d) {
                return d['lat'] != '' && d['lon'] != '';
            });

            // prepare data
            infoData.forEach(function(d) {
                d['lat'] = +d['lat'];
                d['lon'] = +d['lon'];
                d['fern'] = d['fern'] == 'ja' ? 1 : 0;
            });

            // draw long-distance trainstations after rest
            infoData.sort(function(a, b) {
                return a['fern'] - b['fern'];
            });

            // create geo map
            let geoMap = wbGeoMap()
                .width(cv.width)
                .height(cv.height)
                .mapFill(d3wb.color.blue)
                .mapStroke(d3wb.color.blue.fade(10));
            cv.datum(mapData).call(geoMap);

            let pts = cv.selectAll('circle')
                .data(infoData)
                .enter()
                .append('circle')
                .attr('transform', function(d) {
                    let p = geoMap.projection()([d['lon'], d['lat']]);
                    return 'translate(' + p + ')';
                })
                .style('stroke', d3wb.color.yellow.fade(10))
                .style('stroke-width', '0.4')
                .attr('opacity', 0.9)
                .style('fill', function(d) {
                    if (d['fern'] == 1) {
                        return d3wb.color.yellow;
                    } else {
                        return d3wb.color.yellow.fade(20);
                    }
                });

            /* highlight long - distance stations */
            pts.transition().delay(500).duration(1000)
                .attr('r', function(d) {
                    if (d['fern'] == 1) {
                        return 4;
                    } else {
                        return 1;
                    }
                });

            // add tooltips to circles
            let ct = d3wb.mouse.tooltip()
                .color(d3wb.color.background)
                .fill(d3wb.color.foreground)
                .opacity(0.9)
                .padding(5)
                .roundCorners(5)
                .selector(function(d) {
                    return d['station'] + '\n' +
                        d['strasse'] + '\n' +
                        d['plz'] + ' ' + d['stadt'] + '\n#' +
                        d['bhnummer'];
                });
            cv.selectAll('circle').call(ct);

            // annotate bonn
            d3wb.util.injectCSS(`
            .annotation path {
                stroke: ` + d3wb.color.foreground + `;
            }
            .annotation path.connector-dot {
                fill: ` + d3wb.color.foreground + `;
            }
            .annotation text {
                fill: ` + d3wb.color.foreground + `;
            }
            .annotation-note-bg {
                opacity: 0;
            }
        `);

            let an = d3.annotation().annotations([{
                note: {
                    label: 'Bonn Zentrum',
                },
                x: geoMap.projection()([7.0916682, 50.7364716])[0],
                y: geoMap.projection()([7.0916682, 50.7364716])[1],
                dx: -30,
                dy: -60,
            }]);
            cv.append('g').call(an);
        });
})();
