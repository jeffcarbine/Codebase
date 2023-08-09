import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { toggleAccordion, closeAccordion } from "../accordion/accordion.js";

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

addEventDelegate("click", ".dropdown > button", handleDropdownClick);

/**
 * Dropdown Select
 * This is the specific controls for if we have a .dropdown.select
 */

const handleDropdownSelectClick = (dropdownSelectButton) => {
  // so what we need to do is find the main button for the dropdown
  const dropdown = dropdownSelectButton.closest(".dropdown"),
    mainDropdownButton = dropdown.querySelector(":scope > button"),
    mainDropdownBody = dropdown.querySelector(":scope > div");

  // now we just update the text
  const textContent = dropdownSelectButton.textContent;

  mainDropdownButton.textContent = textContent;

  // and toggle the dropdown
  closeAccordion(mainDropdownBody, mainDropdownButton);
};

// addEventDelegate(
//   "click",
//   ".dropdown.select a, .dropdown.select button",
//   handleDropdownSelectClick
// );
