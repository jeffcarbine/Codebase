import { addEventDelegate } from "/periodic/modules/eventDelegate/eventDelegate.js";
import {
  enableToggleNav,
  enableSetNavBackground,
} from "/periodic/elements/nav/nav.js";
import { xhr } from "/periodic/modules/xhr/xhr.js";

enableToggleNav();

const setHeaderBackground = (scrollPos) => {
  const header = document.querySelector("header");

  if (scrollPos > 2) {
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

const twoStepDelete = (button) => {
  const path = button.dataset.path,
    id = button.dataset.id,
    body = {
      id,
    };

  if (button.dataset.parentid) {
    body.parentId = button.dataset.parentid;
  }

  if (button.dataset.parentmodel) {
    body.parentModel = button.dataset.parentmodel;
  }

  const success = () => {
    window.location.reload();
  };

  xhr({ path, body, success });
};

addEventDelegate("click", ".two-step-delete .delete", twoStepDelete);
