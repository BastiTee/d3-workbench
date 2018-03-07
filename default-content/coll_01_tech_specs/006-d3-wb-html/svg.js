(function() {
    // setup canvas
    let cv = d3wb.config().attr('bgColor', 'lightgrey').toCanvas();

    let createText = function(x, y) {
        let text = cv.append('g')
            .attr('transform', 'translate(' + x + ', ' + y + ')')
            .append('text')
            .style('dominant-baseline', 'hanging')
            .style('font-size', '80%');
        return text;
    };
    let left = '10px';
    let elWidth = '180px';
    let col2 = 210;
    let col3 = 350;

    // -----------------------------------------------------------------------
    // DROPDOWN ELEMENT
    // -----------------------------------------------------------------------

    // create a text element to display dropdown info
    let dropdownState = createText(col2, 25);
    // create a callback to handle dropdown changes
    let dropdownCallback = function(value, index) {
        dropdownState.text('[' + index + '] ' + value);
    };
    // create the callback HTML element
    let dropdown = d3wb.html.dropdown()
        .options(['Rock place', 'Hard place'])
        .callback(dropdownCallback)
        .style('top', '20px')
        .style('left', left)
        .style('width', elWidth);
    cv.div.call(dropdown);
    createText(col3, 25).text(dropdown.id());

    // -----------------------------------------------------------------------
    // CLICK BUTTON
    // -----------------------------------------------------------------------

    // create a text element to display button info
    let buttonState = createText(col2, 60);
    // create a callback to handle dropdown changes
    let buttonCallback = function(value, index) {
        buttonState.text('Clicked! ' + Date.now());
    };
    // create the callback HTML element
    let button = d3wb.html.button()
        .callback(buttonCallback)
        .style('top', '55px')
        .style('left', left)
        .style('width', elWidth);
    cv.div.call(button);
    createText(col3, 60).text(button.id());

    // -----------------------------------------------------------------------
    // CHANGING LABEL BUTTON
    // -----------------------------------------------------------------------

    // create a text element to display button info
    let button2State = createText(col2, 90);

    // create a callback to handle dropdown changes
    let button2Callback = function(value, index) {
        button2State.text('[' + index + '] ' + value);
    };
    // create the callback HTML element
    let button2 = d3wb.html.button()
        .callback(button2Callback)
        .options(['Next option', 'Previous option'])
        .style('top', '85px')
        .style('left', left)
        .style('width', elWidth);
    cv.div.call(button2);
    createText(col3, 90).text(button2.id());

    // -----------------------------------------------------------------------
    // TEXT FIELD
    // -----------------------------------------------------------------------

    // create a text element to display button info
    let textfieldState = createText(col2, 121);

    // create a callback to handle dropdown changes
    let textfieldCallback = function(value) {
        textfieldState.text(value);
    };
    // create the callback HTML element
    let textfield = d3wb.html.textfield()
        .callback(textfieldCallback)
        .style('top', '115px')
        .style('left', left)
        .style('width', '167px');
    cv.div.call(textfield);
    createText(col3, 121).text(textfield.id());

    // -----------------------------------------------------------------------
})();
