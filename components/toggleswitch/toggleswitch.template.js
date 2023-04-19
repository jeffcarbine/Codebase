import * as e from "../../elements/elements.js";
import { capitalizeAll } from "../../scripts/formatString/formatString.js";

export const toggleSwitchTemplate = ({
  name,
  id = name,
  value = name,
  label = name,
  labelFor = name,
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
