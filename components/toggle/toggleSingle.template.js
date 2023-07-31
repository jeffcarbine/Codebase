import * as e from "../../elements/elements.js";
import { capitalizeAll } from "../../modules/formatString/formatString.js";
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";

export const toggleSingleTemplate = ({
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
      new e.INPUT(checkboxData),
      new e.LABEL({
        textContent: capitalizeAll(label),
        for: labelFor,
      }),
    ],
  };
};
