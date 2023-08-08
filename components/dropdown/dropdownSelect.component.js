import { DROPDOWN } from "./dropdown.component.js";

export const DROPDOWNSELECT = (className = "", title = "", options = []) => {
  const children = [];

  options.forEach((option) => {
    const button = new e.BTN(option);

    children.push(button);
  });

  const body = {
    children,
  };

  return dropdownTemplate("select " + className, title, body);
};
