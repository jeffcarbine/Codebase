import { addEventDelegate } from "../modules/eventDelegate/eventDelegate.js";

const components = document.querySelectorAll("[data-component]"),
  loadedComponents = [];

const loadComponentScript = (name) => {
  if (!loadedComponents.includes(name)) {
    loadedComponents.push(name);
    import(`./${name}/${name}.scripts.js`);
  }
};

components.forEach((component) => {
  const name = component.dataset.component;

  loadComponentScript(name);
});

const handleMutationComponent = (element) => {
  const componentName = element.dataset.component;

  loadComponentScript(componentName);
};

addEventDelegate("childList", "[data-component]", handleMutationComponent);
