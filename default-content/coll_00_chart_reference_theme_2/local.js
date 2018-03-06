(function() {
    d3wb.theme('dark');
    d3wb.defaultBgColor = d3wb.color.background;

    d3wb.util.injectCSS(`
    * {
        background-color: ` + d3wb.color.background + `;
    }
    .page-footer {
        display: none;
    }
    .page-header-text {
        color: ` + d3wb.color.foreground + ` !important;
    }
    .page-header img {
        display: none;
    }

    .visualization-title {
        background-color: ` + d3wb.color.background + ` !important;
        color: ` + d3wb.color.foreground + `;
    }

    .page-button {
        background-color: ` + d3wb.color.background + ` !important;
        color: ` + d3wb.color.foreground + ` !important;
    }
    `);
})();
