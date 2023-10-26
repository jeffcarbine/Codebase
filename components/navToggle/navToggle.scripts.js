import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

const toggleNav = (button) => {
  const nav = document.querySelector("nav");

  if (nav.classList.contains("open")) {
    nav.classList.remove("open");
    button.classList.remove("open");
  } else {
    nav.classList.add("open");
    button.classList.add("open");
  }

  if (!button.classList.contains("previously-toggled")) {
    button.classList.add("previously-toggled");
  }
};

addEventDelegate("click", "#navToggle", toggleNav);
