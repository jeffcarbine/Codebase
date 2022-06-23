/**
 * Fullscreen
 * This calcuates a realtime --vh custom property that allows us to use
 * true fullscreen values when on devices that modify the window height
 * to accomodate things like navigation bars (cough safari cough)
 * 
 **/

var fullscreen;

// set the --vh custom property
function setVh() {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    fullscreen = window.innerHeight;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", vh + "px");
}

// run once on load
setVh();

// run on resize
window.addEventListener("resize", function () {
    setVh();
});

// run on orientation change
window.addEventListener("orientationchange", function () {
    setVh();
});