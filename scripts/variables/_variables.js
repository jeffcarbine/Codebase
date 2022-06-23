// these are just some handy variables to be able to have access
// to in any Codebase script

var html;
var body;
var nav;
var main;
var footer;

// get custom properties
var htmlStyles;

// breakpoints
var breakpointSm;
var breakpointMd;
var breakpointLg;
var breakpointXl;

function setVariables() {
    html = document.querySelector("html") || false;
    body = document.querySelector("body") || false;
    nav = document.querySelector("nav") || false;
    main = document.querySelector("main") || false;
    footer = document.querySelector("footer") || false;

    // get custom properties
    htmlStyles = getComputedStyle(html);

    // breakpoints
    breakpointSm = parseInt(htmlStyles.getPropertyValue("--breakpoint-sm").replace("px", ""));
    breakpointMd = parseInt(htmlStyles.getPropertyValue("--breakpoint-md").replace("px", ""));
    breakpointLg = parseInt(htmlStyles.getPropertyValue("--breakpoint-lg").replace("px", ""));
    breakpointXl = parseInt(htmlStyles.getPropertyValue("--breakpoint-xl").replace("px", ""));
}

addEventDelegate("load", window, setVariables);