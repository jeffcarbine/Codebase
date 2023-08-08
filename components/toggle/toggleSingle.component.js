import { INPUT, LABEL } from "../../elements/input/input.element.js";
import { capitalizeAll } from "../../modules/formatString/formatString.js";
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";

export const TOGGLESINGLE = ({
  name,
  id = generateUniqueId(),
  value = name,
  label = "",
  labelFor = id,
  checked = false,
  dataTargets,
} = {}) => {
  const checkboxData = {
    type: "checkbox",
    id,
    name,
    value,
  };

  if (checked) {
    checkboxData.checked = checked;
  }

  if (dataTargets !== undefined) {
    checkboxData["data-targets"] = dataTargets;
  }

  return {
    class: "toggle single",
    children: [
      new INPUT(checkboxData),
      new LABEL({
        textContent: capitalizeAll(label),
        for: labelFor,
      }),
    ],
  };
};
