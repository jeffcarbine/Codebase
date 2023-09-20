import { DROPDOWN } from "./dropdown.component.js";
import { RADIOLABEL, ULLI } from "../../elements/elements.js";
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";

export const DROPDOWNSELECT = ({
  className = "",
  title = "",
  name = "",
  options = [],
} = {}) => {
  const children = [];

  let dropdownTitle = title;

  if (name === "") {
    name = generateUniqueId();
  }

  options.forEach((option, index) => {
    option.name = name;

    if (index === 0) {
      option.checked = true;
      dropdownTitle = option.label;
    }

    const button = new RADIOLABEL(option);

    children.push(button);

    if (dropdownTitle === "") {
      dropdownTitle = option.textContent;
    }
  });

  const body = {
    child: new ULLI(children),
  };

  return DROPDOWN({
    className: "select " + className,
    title: dropdownTitle,
    body,
  });
};
