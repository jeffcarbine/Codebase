import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { cartBodyTemplate } from "./cart.component.js";

const toggleCart = (button) => {
  const cart = document.querySelector("#cart");

  cart.classList.toggle("open");
  button.classList.toggle("open");
};

const closeCart = () => {
  const cart = document.querySelector("#cart"),
    cartToggle = document.querySelector("#cartToggle");

  cart.classList.remove("open");
  cartToggle.classList.remove("open");
};

const setCartToLoading = () => {
  const cartBody = document.querySelector("#cartBody");

  cartBody.innerHTML = "";
  cartBody.classList.add("loading");
};

export const update = (request) => {
  const cartData = JSON.parse(request.response),
    cartBody = document.querySelector("#cartBody");

  cartBody.classList.remove("loading");

  const newCartBody = renderTemplate(cartBodyTemplate(cartData));

  cartBody.appendChild(newCartBody);
};

export const modifyLineItem = (button) => {
  setCartToLoading();

  const body = {
    itemId: button.dataset.itemId,
    quantity: button.dataset.quantity,
  };

  xhr({
    path: "/shop/modify-line-item",
    body,
    success: update,
  });
};

export const retrieve = () => {
  setCartToLoading();

  xhr({
    path: "/shop/cart",
    success: update,
  });
};

const addToCart = () => (button) => {
  setCartToLoading();

  button.classList.add("loading");

  const variant =
    document.querySelector("input[name='variant']:checked") !== null
      ? document.querySelector("input[name='variant']:checked")
      : document.querySelector("input[name='variant']");

  const variantId = variant.value;

  const success = (request) => {
    const cart = document.querySelector("#cart"),
      cartToggle = document.querySelector("#cartToggle");
    cart.classList.add("open");
    cartToggle.classList.add("open");

    button.classList.remove("loading");
    update(request);
  };

  xhr({
    path: "/shop/add-to-cart",
    body: { variantId },
    callbacks: { success },
  });
};

export const delegate = () => {
  addEventDelegate("click", "#cartClose", closeCart);
  addEventDelegate("click", "#cartToggle", toggleCart);
  addEventDelegate("click", "#addToCart", addToCart);
};
