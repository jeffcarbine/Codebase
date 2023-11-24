export const isInViewport = (query, enterCallback, exitCallback) => {
  // when the observer runs
  const observerCallback = (entries) => {
    // reivew all the corresponding vclass entries
    entries.forEach((entry) => {
      // if we find it to be intersecting the viewport
      if (entry.isIntersecting) {
        enterCallback(entry.target);
      } else {
        exitCallback(entry.target);
      }
    });
  };

  // get the elements that match the query
  const vclassElements = document.querySelectorAll(query);

  // and then observe each one
  vclassElements.forEach((element) => {
    // check just in case there are no matching elements
    if (element) {
      // observe it!

      // create the intersection observer for vclass
      var observer = new IntersectionObserver(observerCallback, {
        //rootMargin: element.dataset.vclassMargin || "-200px",
        threshold: 0,
      });

      observer.observe(element);
    }
  });
};
