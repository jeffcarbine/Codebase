import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { smoothScroll } from "../../scripts/smoothScroll/smoothScroll.js";

function skipToMain() {
  let main = document.querySelector("main");
  main.setAttribute("tabindex", "0");

  smoothScroll("main");
  main.focus();
}

addEventDelegate("click", "#skipToMainContent", skipToMain);
