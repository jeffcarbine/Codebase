/**
 * Check Device
 * Adds a class of desktop-browser or mobile-browser to the document
 * so you can target environments via CSS or JavaScript more easily
 * 
 * This is _not_ for checking screen size, as this will _not_ run
 * when you resize a desktop browser down to a phone. It is to tell whether
 * we are _actually_ on a mobile device or not, or if we are emulating
 * a mobile device or not.
 */

// check to see if we are on desktop or not
function isDesktop() {
    return !(typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

// now, check if we are desktop or not desktop
function checkDevice() {
    let html = document.querySelector("html");

    // if we are on desktop, then its desktop
    if (isDesktop()) {
        html.classList.remove("mobile-browser");
        html.classList.add("desktop-browser");
    } else {
        // otherwise, it's mobile
        html.classList.remove("desktop-browser");
        html.classList.add("mobile-browser");
    }
}

// run once on load
checkDevice();