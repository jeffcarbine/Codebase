import { addEventDelegate } from "../modules/eventDelegate/eventDelegate.js";

const components = document.querySelectorAll("[data-component]"),
  loadedComponents = [];

const loadComponentScript = (name) => {
  if (!loadedComponents.includes(name)) {
    loadedComponents.push(name);

    // if the name has a slash in it, it is a sub-component
    // and we need to load it from a sub-directory
    if (name.includes("/")) {
      import(`./${name}.scripts.js`);
    } else {
      import(`./${name}/${name}.scripts.js`);
    }
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
