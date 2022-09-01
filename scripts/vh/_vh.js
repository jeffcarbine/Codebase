/**
 * vh
 *
 * This calcuates a realtime --vh custom property that allows us to use
 * true fullscreen values when on devices that modify the window height
 * to accomodate things like navigation bars (cough safari cough)
 *
 **/

let currentViewportHeight = window.innerHeight,
  currentViewportWidth = window.innerWidth;

// set the --vh custom property
function setViewportValues() {
  // store height/width values
  currentViewportHeight = window.innerHeight;
  currentViewportWidth = window.innerWidth;

  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = currentViewportHeight * 0.01,
    vw = currentViewportHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", vh + "px");
  document.documentElement.style.setProperty("--vw", vh + "px");
}

// run once on load
setViewportValues();

// run on resize events,
// only run every 250px
window.addEventListener("resize", function () {
  if (
    window.innerHeight > currentViewportHeight + 250 ||
    window.innerWidth > currentViewportWidth + 250 ||
    window.innerHeight < currentViewportHeight - 250 ||
    window.innerWidth < currentViewportWidth - 250
  ) {
    setViewportValues();
  }
});

// run on orientation change
window.addEventListener("orientationchange", function () {
  setViewportValues();
});
