import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { cartContentTemplate } from "./cart.component.js";
import { dataBind } from "../../modules/dataBind/dataBind.js";

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

export const setCartToLoading = () => {
  const cartContent = document.querySelector("#cartContent");

  cartContent.innerHTML = "";
  cartContent.classList.add("loading");
};

export const update = (request) => {
  const cartData = JSON.parse(request.response),
    cartContent = document.querySelector("#cartContent");

  cartContent.classList.remove("loading");

  const newcartContent = renderTemplate(cartContentTemplate(cartData));

  dataBind("cartCount", cartData.lineItems.length);

  cartContent.appendChild(newcartContent);
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

export const delegate = () => {
  addEventDelegate("click", "#cartClose, #cartOverlay", closeCart);
  addEventDelegate("click", "#cartToggle", toggleCart);
};
