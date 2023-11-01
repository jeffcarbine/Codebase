import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

const toggleCart = (button) => {
  const target = button.dataset.target,
    cart = document.querySelector(target);

  cart.classList.toggle("open");
  button.classList.toggle("open");
};

addEventDelegate("click", "#cartToggle", toggleCart);
