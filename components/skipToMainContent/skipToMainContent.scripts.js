import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { smoothScroll } from "../../scripts/smoothScroll/smoothScroll.js";

function skipToMainContent(button) {
  const query = button.dataset.query;

  let mainContent = document.querySelector(query);
  mainContent.setAttribute("tabindex", "0");

  smoothScroll(query);
  mainContent.focus();
}

addEventDelegate("click", "#skipToMainContent", skipToMainContent);
