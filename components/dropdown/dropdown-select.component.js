import { DROPDOWN } from "./dropdown.component.js";

export const DROPDOWNSELECT = (className = "", title = "", body = {}) => {
  return DROPDOWN("select " + className, title, body);
};
