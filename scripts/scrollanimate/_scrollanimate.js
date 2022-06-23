// NOTE: when possible, update to intersection observer

// first, check to see if anything visible on page has the class of "scrollanimate"
let scrollanimateElements = document.querySelectorAll(".scrollanimate");

// we need to initialize this on window load because we need to be sure all images have
// loaded, otherwise they'll mess up this check
function initializeScrollAnimateElements() {
  // initially check to see if there are any scrollanimate elements that are
  // visible right now
  scrollanimateElements.forEach(function (element) {
    checkScrollanimateElement();
  });

  // and then add the scroll event to fire again on scroll
  window.addEventListener("scroll", function () {
    // only run if there are any scrollanimateElements
    if (scrollanimateElements.length > 0) {
      checkScrollanimateElement();
    }
  });
}

// checks to see if the element is X% in the viewport
function isInViewport(el) {
  // percentage we're looking for
  var percentVisible = 0.75;
  // element's position
  var elemTop = el.getBoundingClientRect().top;
  var elemBottom = el.getBoundingClientRect().bottom;
  var elemHeight = el.getBoundingClientRect().height;
  var overhang = elemHeight * (1 - percentVisible);

  // check if it falls within that visibility
  var isVisible =
    elemTop >= -overhang && elemBottom <= window.innerHeight + overhang;
  return isVisible;
}

// checks to see if we are in viewport
function checkScrollanimateElement() {
  scrollanimateElements.forEach(function (element) {
    // if in viewport, then remove the scrollanimate class
    // and give it the animate class, which will trigger the animation
    if (isInViewport(element)) {
      element.classList.remove("scrollanimate");
      element.classList.add("animate");

      // update the scrollanimateElements
      scrollanimateElements = document.querySelectorAll(".scrollanimate");
    }
  });
}

addEventDelegate("load", window, initializeScrollAnimateElements);
