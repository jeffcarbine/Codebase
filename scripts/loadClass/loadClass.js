/**
 * Load Class
 *
 * This will add a class to an element when it is loaded
 */

// get any loadclass elements
const loadClassElements = document.querySelectorAll("[data-loadclass]");

const loadClass = (element) => {
  const className = element.dataset.loadclass;

  element.classList.add(className);

  // find any loadclass listeners
  const listenerId = element.id,
    loadClassListeners = document.querySelectorAll(
      "[data-loadclass-listenerid=" + listenerId + "]"
    );

  loadClassListeners.forEach((listener) => {
    listener.classList.add(className);
  });
};

loadClassElements.forEach((element) => {
  if (element.complete) {
    loadClass(element);
  } else {
    element.onload = () => {
      loadClass(element);
    };
  }
});
