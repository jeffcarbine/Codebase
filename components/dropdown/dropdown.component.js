import { BUTTON } from "../../elements/elements.js";

export const DROPDOWN = ({
  className = "",
  title = "",
  body = {},
  btn = true,
} = {}) => {
  const btnParams = {};

  if (btn) {
    btnParams.class = "btn";
  }

  if (typeof title === "string") {
    btnParams.textContent = title;
  } else {
    btnParams.children = title;
  }

  return {
    "data-component": "dropdown",
    class: "dropdown " + className,
    children: [new BUTTON(btnParams), body],
  };
};
