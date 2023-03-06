import * as e from "../../elements/elements.js";

export const stateSliderTemplate = (params) => {
  const elements = [];

  for (let i = 0; i < params.states.length; i++) {
    const element = params.states[i];

    // add the state data
    element["data-state"] = i;

    const elementClass = "element element" + i;

    // add the class of element
    if (element.class === undefined) {
      element.class = elementClass;
    } else {
      element.class = element.class + " " + elementClass;
    }

    elements.push(element);
  }

  let stateSliderType;

  if (params.states.length > 7) {
    stateSliderType = "lg";
  } else if (params.states.length > 5) {
    stateSliderType = "md";
  } else {
    stateSliderType = "sm";
  }

  const stateSlider = {
    class: "stateSlider " + stateSliderType,
    "data-state": params.state !== undefined ? params.state : 0,
    "data-states-length": params.states.length,
    "data-state-targets": params.targets,
    children: [
      {
        class: "dummy",
        child: elements[0],
      },
      {
        class: "stateButtons",
        children: [
          new e.BUTTON({
            className: "next",
          }),
          new e.BUTTON({
            className: "previous",
          }),
        ],
      },
      {
        class: "elements",
        children: elements,
      },
    ],
  };

  return stateSlider;
};
