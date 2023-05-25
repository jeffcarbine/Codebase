import * as e from "../../elements/elements.js";

export const dropdownTemplate = (className = "", title = "", body = {}) => {
  return {
    class: "dropdown " + className,
    children: [
      new e.BUTTON({
        textContent: title,
      }),
      body,
    ],
  };
};
