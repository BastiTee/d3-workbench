(function(){
    d3wb.theme("dark")
    d3wb.util.injectCSS(`
    * {
        background-color: ` + d3wb.color.background + `;
    }
    
    .page-footer {
        display: none;
    }

    .page-header-text {
        color: ` + d3wb.color.foreground + `;
    }

    .page-header img {
        display: none;
    }
    
    .visualization-title {
        background-color: ` + d3wb.color.background + `;
        color: ` + d3wb.color.foreground + `;
    }
    
    .page-button {
        background-color: ` + d3wb.color.background + `;
        color: ` + d3wb.color.foreground + `;
    }

    `)
})()