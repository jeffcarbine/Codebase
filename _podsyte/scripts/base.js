import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import {
  enableToggleNav,
  enableSetNavBackground,
} from "/periodic/elements/nav/nav.js";
import { initModals } from "/periodic/components/modal/modal.js";
import { xhrForm } from "/periodic/modules/xhr/xhr.js";

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

const showFullNav = () => {
  clearTimeout(fullNavTimeout);

  const body = document.querySelector("body");

  fullNavTimeout = setTimeout(() => {
    body.classList.add("fullNav");
  }, 500);
};

addEventDelegate("mouseover", "nav", showFullNav);

let fullNavTimeout;

const hideFullNav = () => {
  clearTimeout(fullNavTimeout);

  const body = document.querySelector("body");

  fullNavTimeout = setTimeout(() => {
    body.classList.remove("fullNav");
  }, 1000);
};

addEventDelegate("mouseout", "nav", hideFullNav);
