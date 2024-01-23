import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

const toggleNav = (button) => {
  const nav = document.querySelector("nav"),
    query = button.dataset.target,
    target = document.querySelector(query);

  if (target.classList.contains("open")) {
    target.classList.remove("open");
    button.classList.remove("open");
  } else {
    target.classList.add("open");
    button.classList.add("open");
  }

  if (!button.classList.contains("previously-toggled")) {
    button.classList.add("previously-toggled");
  }
};

addEventDelegate("click", "#navToggle", toggleNav);
