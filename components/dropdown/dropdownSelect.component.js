import { DROPDOWN, BTN } from "../components.js";
import { RADIOLABEL } from "../../elements/elements.js";
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";

export const DROPDOWNSELECT = ({
  className = "",
  title = "",
  options = [],
} = {}) => {
  const children = [];

  let dropdownTitle = title;

  const name = generateUniqueId();

  options.forEach((option, index) => {
    option.name = name;
    option.class += " btn";

    const button = new RADIOLABEL(option);

    children.push(button);

    if (dropdownTitle === "") {
      dropdownTitle = option.textContent;
    }
  });

  const body = {
    children,
  };

  return DROPDOWN("select " + className, dropdownTitle, body);
};
