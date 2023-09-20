import { BTN } from "../components.js";

export const DROPDOWN = ({ className = "", title = "", body = {} } = {}) => {
  const btnParams = {
    class: "btn",
  };

  if (typeof title === "string") {
    btnParams.textContent = title;
  } else {
    btnParams.children = title;
  }

  return {
    "data-component": "dropdown",
    class: "dropdown " + className,
    children: [new BTN(btnParams), body],
  };
};
