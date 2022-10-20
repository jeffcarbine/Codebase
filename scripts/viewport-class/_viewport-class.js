/**
 * Viewport Class
 * Allows you to add classes to an element when they
 * enter the viewport
 */

// the class isn't added immediately, there's a 150px threshold
// it has to cross before the class is added, just so animations aren't lost
const observerOptions = {
  rootMargin: "-150px",
  threshold: 0,
};

// create the intersection observer for vclass
var vclassObserver = new IntersectionObserver(
  observerCallback,
  observerOptions
);

// when the observer runs
function observerCallback(entries, vclassObserver) {
  // reivew all the corresponding vclass entries
  entries.forEach((entry) => {
    // if we find it to be intersecting the viewport
    if (entry.isIntersecting) {
      // get the element
      let element = entry.target;
      // get it's vclass data property, plus a space
      let vclass = " " + element.dataset.vclass;
      // add that to the end of the element's className
      element.className += vclass;
      // and then stop observing this entry
      vclassObserver.unobserve(element);
    }
  });
}

// on page load, get all the elements that have a data-vclass property
const vclassElements = document.querySelectorAll("[data-vclass]");

// and then observe each one
vclassElements.forEach((element) => {
  // check just in case there are no matching elements
  if (element) {
    // observe it!
    vclassObserver.observe(element);
  }
});
