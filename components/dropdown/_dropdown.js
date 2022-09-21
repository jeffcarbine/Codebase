import { addEventDelegate } from "../../scripts/eventdelegate/_eventdelegate.js";
import { toggleAccordion } from "../accordion/_accordion.js";

/**
 * Dropdown
 * This handles the opening and closing of dropdowns
 * It uses the same script as the accordion, so we just
 * import it here
 */

const handleDropdownClick = (dropdownButton) => {
  let dropdownBody = dropdownButton.nextElementSibling;

  toggleDropdown(dropdownBody, dropdownButton);
};

const toggleDropdown = (dropdownBody, dropdownButton) => {
  toggleAccordion(dropdownBody, dropdownButton);
};

export { toggleDropdown };

addEventDelegate("click", ".dropdown > button", handleDropdownClick);
