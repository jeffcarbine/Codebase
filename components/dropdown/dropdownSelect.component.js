import { DROPDOWN } from "./dropdown.component.js";
import { BTN } from "../btn/btn.component.js";

export const DROPDOWNSELECT = (className = "", title = "", options = []) => {
  const children = [];

  options.forEach((option) => {
    const button = new BTN(option);

    children.push(button);
  });

  const body = {
    children,
  };

  return DROPDOWN("select " + className, title, body);
};
