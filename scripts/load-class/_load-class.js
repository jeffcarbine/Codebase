// const addClassOnLoad = (element) => {
//   console.log("image has loaded!");
//   const loadClass = element.dataset.loadclass;

//   element.classList.add(loadClass);

//   // find any loadclass listeners
//   const listenerId = element.id,
//     loadClassListeners = document.querySelectorAll("[data-loadclass-listenerid]=" + listenerId);

//     console.log(loadClassListeners);
// }

// get any loadclass elements
const loadClassElements = document.querySelectorAll("[data-loadclass]");

loadClassElements.forEach((element) => {
  element.onload = () => {
    const loadClass = element.dataset.loadclass;

    element.classList.add(loadClass);

    // find any loadclass listeners
    const listenerId = element.id,
      loadClassListeners = document.querySelectorAll(
        "[data-loadclass-listenerid=" + listenerId + "]"
      );

    loadClassListeners.forEach((listener) => {
      listener.classList.add(loadClass);
    })
  };
});
