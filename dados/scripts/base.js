import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import {
  enableToggleNav,
  enableSetNavBackground,
} from "/periodic/elements/nav/_nav.js";
import { initModals } from "/periodic/components/modal/modal.js";

initModals();
enableToggleNav();

const setHeaderBackground = (scrollPos) => {
  const header = document.querySelector("header");

  if (scrollPos > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
};

addEventDelegate("scroll", window, setHeaderBackground);
