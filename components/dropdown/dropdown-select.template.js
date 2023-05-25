import { dropdownTemplate } from "./dropdown.template.js";

export const dropdownSelectTemplate = (
  className = "",
  title = "",
  body = {}
) => {
  return dropdownTemplate("select " + className, title, body);
};
