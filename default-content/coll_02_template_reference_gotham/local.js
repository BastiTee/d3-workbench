(function(){
    d3wb.theme("gotham")
    d3wb.util.injectCSS(`
    * {
        background-color: ` + d3wb.color.background + `;
        color: ` + d3wb.color.foreground + `;
    }
    
    #loadoverlay {
        background-color: ` + d3wb.color.background + `;
    }
    
    #loadspinner>* {
        background-color: ` + d3wb.color.foreground + `;
    }
    
    .footer {
        display: none;
    }

    .header .text {
        color: ` + d3wb.color.foreground + `;
    }

    .button {
        display: none;
    }
    
    .image img {
        display: none;
    }

    body::-webkit-scrollbar {
        width: 0px;
        background: transparent;
    }
    `)
})()