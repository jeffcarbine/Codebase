const components = document.querySelectorAll("[data-component]"),
  loadedComponents = [];

components.forEach((component) => {
  const name = component.dataset.component;

  if (!loadedComponents.includes(name)) {
    loadedComponents.push(name);
    import(`./${name}/${name}.scripts.js`);
  }
});
