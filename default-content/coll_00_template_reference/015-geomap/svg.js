// DATA SOURCE:
// http://www.datendieter.de/item/Alle_Bahnhoefe_in_Deutschland_mit_Geo-Koordinaten
var cv = d3wb.initConfig()
    .data(["de-federal-states.json", "data.csv"])
    .initCanvas()

d3.queue()
    .defer(d3.json, cv.config.data()[0])
    .defer(d3.csv, cv.config.data()[1])
    .await(function(error, mapData, infoData) {

        // only datasets with lat/lon set
        infoData = infoData.filter(function(d) {
            return d["lat"] != "" && d["lon"] != ""
        })

        // prepare data
        infoData.forEach(function(d) {
            d["lat"] = +d["lat"]
            d["lon"] = +d["lon"]
            d["fern"] = d["fern"] == "ja" ? 1 : 0
        })

        // draw long-distance trainstations after rest
        infoData.sort(function(a, b) {
            return a["fern"] - b["fern"]
        })

        // create geo map
        var geoMap = wbGeoMap()
            .width(cv.width)
            .height(cv.height)
            .mapFill(d3wb.color.yellow)
            .mapStroke(d3wb.color.yellow.fade(10))
            .dotFill(function(d) {
                if (d["fern"] == 1) {
                    return d3wb.color.red
                } else {
                    return d3wb.color.magenta
                }
            })
            .dotStroke(d3wb.color.yellow.fade(10))
            .radius(function(d) {
                if (d["fern"] == 1) {
                    return 4
                } else {
                    return 2
                }
            })
            .mapData(mapData)
        cv.svg.datum(infoData).call(geoMap)

        // add tooltips to circles 
        var ct = wbCooltip()
            .color(d3wb.color.background)
            .fill(d3wb.color.foreground)
            .opacity(0.9)
            .padding(5)
            .roundCorners(5)
            .selector(function(d) {
                return d["station"] + "\n" +
                    d["strasse"] + "\n" +
                    d["plz"] + " " + d["stadt"] + "\n#" +
                    d["bhnummer"]
            })
        cv.svg.selectAll("circle").call(ct)

        // annotate bonn
        d3wb.injectCSS(`
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
        `)

        var an = d3.annotation().annotations([{
            note: {
                label: "Bonn Zentrum"
            },
            x: geoMap.projection()([7.0916682, 50.7364716])[0],
            y: geoMap.projection()([7.0916682, 50.7364716])[1],
            dx: -100,
            dy: -200
        }])
        cv.svg.append("g").call(an)

    });