(function() {
    let cv = d3wb.config()
        .attr('height', 280)
        .toCanvas();

    let plotGradient = function(data, idx, descr) {
        idx = idx * height;
        let rectWid = cv.w / data.length;

        let tt = d3wb.mouse.tooltip()
            .selector(function() {
                return descr;
            });

        cv.append('g')
            .attr('id', 'gradient' + idx)
            .attr('transform', 'translate(0, ' + idx + ')').selectAll('rect')
            .data(data).enter()
            .append('rect')
            .attr('width', rectWid)
            .attr('height', height)
            .attr('x', function(d, i) {
                return rectWid * i;
            })
            .attr('fill', function(d) {
                return d;
            })
            .call(tt);
    };

    // /////////////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////////////
    // /////////////////////////////////////////////////////////////////

    let id = -1;
    const height = 20;

    /* ------- a basic category from d3.js ------------ */
    id += 1;
    let data = d3wb.color.array(d3.schemeCategory20c);
    plotGradient(data, id, 'Default d3.schemeCategory20c');

    /* ------ a simple gradient ----- */
    id += 1;
    data = d3wb.color.gradientArray('red', 'cyan', 30);
    plotGradient(data, id, 'Basic red to cyan gradient');
    id += 1;
    data = d3wb.color.gradientArray(d3wb.color.cyan, d3wb.color.magenta, 50);
    plotGradient(data, id, 'Basic cyan to magenta gradient');

    /* ------- a similiar category autocreated from theme------ */
    id += 1;
    data = d3wb.color.category();
    plotGradient(data, id, 'd3wb schema category');

    /* ------ hi lo gradients using left/right function ----- */
    let cols = d3wb.theme();
    // var cols = ["red"]
    for (let i = 0; i < cols.length; i++) {
        id += 1;
        data = d3wb.color.lohiScaleArray(cols[i], 30);
        plotGradient(data, id, 'd3wb hi-lo gradient for ' + cols[i]);
    }
})();
