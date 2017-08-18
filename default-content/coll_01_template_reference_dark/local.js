(function(){
    d3wb.theme("dark")
    d3wb.util.injectCSS(`
    * {
        background-color: ` + d3wb.color.background + `;
        color: ` + d3wb.color.foreground + `;
    }
    
    .footer {
        display: none;
    }

    .header .text {
        color: ` + d3wb.color.foreground + `;
    }

    .image img {
        display: none;
    }
    
    .d3entry-title {
        background-color: ` + d3wb.color.background + `;
    }
    
    .button {
        background-color: ` + d3wb.color.background + `;
        color: ` + d3wb.color.foreground + `;
    }

    `)
})()