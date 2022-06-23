/**
 * Is IE
 * Lets us know if we are in Internet Explorer
 * 
 * It's 2020 right now and I'm just waiting for the day that we no longer
 * have to support IE in any fashion
 * 
 * Though I guess that means we'll probably just update this to isEdge() :/
 */

function isIE() {
    // get user agent
    ua = navigator.userAgent;
    // MSIE used to detect old browsers and Trident used to newer ones
    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

    return is_ie;
}