(function() {

    // setup canvas 
    var cv = d3wb.config().attr("bgColor", "lightgrey").toCanvas()

    var createText = function(x, y) {
        var text = cv.append("g")
            .attr("transform", "translate(" + x + ", " + y + ")")
            .append("text")
            .style("alignment-baseline", "hanging")
            .style("font-size", "80%")
        return text
    }
    var left = "10px"
    var col2 = 110
    var col3 = 310

    // -----------------------------------------------------------------------
    // DROPDOWN ELEMENT 
    // -----------------------------------------------------------------------

    // create a text element to display dropdown info 
    var dropdownState = createText(col2, 25)
    // create a callback to handle dropdown changes
    var dropdownCallback = function(value, index) {
        dropdownState.text("[" + index + "] " + value);
    }
    // create the callback HTML element 
    var dropdown = d3wb.html.dropdown()
        .options(["Rock place", "Hard place"])
        .callback(dropdownCallback)
        .style("top", "20px")
        .style("left", left)
        .style("width", "95px")
    cv.div.call(dropdown)
    createText(col3, 25).text(dropdown.id())

    // -----------------------------------------------------------------------
    // CLICK BUTTON
    // -----------------------------------------------------------------------

    // create a text element to display button info 
    var buttonState = createText(col2, 60)
    // create a callback to handle dropdown changes
    var buttonCallback = function(value, index) {
        buttonState.text("Clicked! " + Date.now());
    }
    // create the callback HTML element 
    var button = d3wb.html.button()
        .callback(buttonCallback)
        .style("top", "55px")
        .style("left", left)
        .style("width", "95px")
    cv.div.call(button)
    createText(col3, 60).text(button.id())

    // -----------------------------------------------------------------------
    // CHANGING LABEL BUTTON
    // -----------------------------------------------------------------------

    // create a text element to display button info 
    var button2State = createText(col2, 90)

    // create a callback to handle dropdown changes
    var button2Callback = function(value, index) {
        button2State.text("[" + index + "] " + value);
    }
    // create the callback HTML element 
    var button2 = d3wb.html.button()
        .callback(button2Callback)
        .options(["Next option", "Previous option"])
        .style("top", "85px")
        .style("left", left)
        .style("width", "95px")
    cv.div.call(button2)
    createText(col3, 90).text(button2.id())

    // -----------------------------------------------------------------------
    // TEXT FIELD
    // -----------------------------------------------------------------------

    // create a text element to display button info 
    var textfieldState = createText(col2, 121)

    // create a callback to handle dropdown changes
    var textfieldCallback = function(value) {
        textfieldState.text(value);
    }
    // create the callback HTML element 
    var textfield = d3wb.html.textfield()
        .callback(textfieldCallback)
        .style("top", "115px")
        .style("left", left)
        .style("width", "92px")
    cv.div.call(textfield)
    createText(col3, 121).text(button2.id())

    // -----------------------------------------------------------------------


})()