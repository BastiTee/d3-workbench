function wbTextbox() {

    var text = "text",
        fontsize = 12,
        x = 10,
        y = 30,
        width = 100,
        height = 20,
        stroke = d3.rgb(240, 240, 240),
        fill = d3.rgb(255, 255, 255),
        cover,
        rct,
        txt

    var focused = false;
    var aligntext = function() {
        txt_width = txt.node().getComputedTextLength();
        txt.attr("x", .5 * (width - txt_width));
        txt.attr("y", .5 * (height + fontsize) - 2);
    };

    var callback = function(cont) {
        console.log("Text: " + cont);
    }

    var keydown = function() {
        console.log("-- keydown (" + focused + ") | " + d3.event.keyCode);
        if (!focused) return;
        var code = d3.event.keyCode;
        var cont = txt.text()
        if (code == 8) { // Backspace
            d3.event.preventDefault();
            cont = cont.substring(0, cont.length - 1);
            aligntext()
            txt.text(cont)
        };
        if (code == 13) { // Enter
            cont = cont.trim()
            console.log("CALLING '" + cont + "'");
            callback(cont);
        };
        if (code == 27) {
            rct.style("stroke", stroke)
            rct.style("fill", "white")
            focused = false
            callback(undefined)
        }
    }

    var keypress = function() {
        console.log("-- keypress (" + focused + ")");
        if (!focused) return;
        var cont = txt.text();
        var code = d3.event.keyCode;
        if (code == 13 || code == 8 || code == 27)
            return
        cont = cont + String.fromCharCode(code);
        txt.text(cont)
        aligntext()
    }

    function chart(selection) {

        selection.each(function() {

            var s = d3.select(this)

            d3.select("body")
                .on("keydown", keydown)
                .on("keypress", keypress)
                .on("click", function() {
                    console.log("-- clicked (" + focused + ")");
                    if (focused) {
                        rct.attr("stroke", stroke)
                        focused = false;
                    }
                });

            var textgroup = s.append("g")
                .attr("transform", "translate(" + x + "," + y + ")");

            rct = textgroup.append("rect")
                .attr("width", width)
                .attr("height", height)
                .style("fill", fill)
                .style("stroke-width", "1px")
                .style("stroke", stroke)
                .style("opacity", 1);
            txt = textgroup.append("text")
                .text(text)
                .style("fill", "black")
            cover = textgroup.append("rect") // Transparent cover to hide cursor when mousing over text
                .attr("width", width)
                .attr("height", height)
                .style("opacity", 0);

            cover.on("click", function() {
                focused = true;
                rct.style("stroke", "#347bbe");
                rct.style("fill", "yellow")
                d3.event.stopPropagation();
            })

            var txt_width = txt.node().getComputedTextLength();
            txt.attr("x", .5 * (width - txt_width));
            txt.attr("y", .5 * (height + fontsize) - 2);
        })
    }


    chart.callback = function(value) {
        if (!arguments.length) return callback
        callback = value;
        return chart;
    }
    return chart;
}