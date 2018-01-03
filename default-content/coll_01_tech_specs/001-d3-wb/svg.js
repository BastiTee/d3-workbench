(function() {
    let marginToString = function(obj) {
        return obj['top'] + ',' + obj['right'] + ',' +
            obj['bottom'] + ',' + obj['left'];
    };

    let cfg1 = d3wb.config();
    console.log('cfg.data  | ' + cfg1.data());
    cfg1.attr('margin', '50 50 50 50')
        .attr('debug', true)
        .data(['data.csv']);
    console.log('cfg.data  | ' + cfg1.data());

    let cv = cfg1.toCanvas();
    console.log('cv.width  | ' + cv.width);
    console.log('cv.height | ' + cv.height);
    console.log('cv.wid    | ' + cv.wid);
    console.log('cv.hei    | ' + cv.hei);
    console.log('cv.w      | ' + cv.w);
    console.log('cv.h      | ' + cv.h);
    console.log('cv.margin | ' + marginToString(cv.margin));
    console.log('cv.mar    | ' + marginToString(cv.mar));
    console.log('cv.m      | ' + marginToString(cv.m));
    console.log('cv.config | ' + cv.config);
    console.log('cv.con    | ' + cv.con);
    console.log('cv.c      | ' + cv.c);
    console.log('cv.data   | ' + cv.data);
    console.log('cv.d      | ' + cv.d);
    console.log('cv.svg    | ' + cv.svg.node());

    d3.csv(cv.data[0], function(error, data) {
        console.log(data);
        cv.selectAll('.rects')
            .data(data).enter()
            .append('rect')
            .attr('x', function(d) {
                return d['id'] * 10;
            })
            .attr('y', function(d) {
                return d['id'] * 10;
            })
            .attr('width', function(d) {
                return d['id'] * 10;
            })
            .attr('height', function(d) {
                return d['id'] * 10;
            })
            .attr('fill', d3wb.color.red);
    });
})();
