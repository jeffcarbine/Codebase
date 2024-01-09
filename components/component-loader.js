import { addEventDelegate } from "../modules/eventDelegate/eventDelegate.js";

const components = document.querySelectorAll("[data-component]"),
  loadedComponents = [];

const loadComponentScript = (name, parent = "periodic") => {
  if (!loadedComponents.includes(name)) {
    loadedComponents.push(name);

    // if the name has a slash in it, it is a sub-component
    // and we need to load it from a sub-directory
    if (name.includes("/")) {
      import(`/${parent}/components/${name}.scripts.js`);
    } else {
      import(`/${parent}/components/${name}/${name}.scripts.js`);
    }
  }
};

components.forEach((component) => {
  const name = component.dataset.component,
    parent = component.dataset.parent;

  if (parent !== undefined) {
    loadComponentScript(name, parent);
  } else {
    loadComponentScript(name);
  }
});

const handleMutationComponent = (element) => {
  const name = element.dataset.component,
    parent = element.dataset.parent;

  if (parent !== undefined) {
    loadComponentScript(name, parent);
  } else {
    loadComponentScript(name);
  }
};

addEventDelegate("childList", "[data-component]", handleMutationComponent);
