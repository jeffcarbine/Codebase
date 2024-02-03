import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

function skipToMain() {
  let main = document.querySelector("main");
  main.setAttribute("tabindex", "0");

  setTimeout(() => {
    main.focus();
  }, 500);
}

addEventDelegate("click", "#skipToMain", skipToMain);
