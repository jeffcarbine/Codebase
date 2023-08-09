import { BUTTON } from "../../components/btn/btn.element.js";

export const DROPDOWN = (className = "", title = "", body = {}) => {
  return {
    class: "dropdown " + className,
    children: [
      new BUTTON({
        textContent: title,
      }),
      body,
    ],
  };
};
