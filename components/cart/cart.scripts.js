import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { cartContentTemplate } from "./cart.html.js";
import { dataBind } from "../../modules/dataBind/dataBind.js";

const closeCart = () => {
  const cartToggle = document.querySelector("#cartToggle"),
    cartTarget = cartToggle.dataset.target,
    cart = document.querySelector(cartTarget);

  cart.classList.remove("open");
  cartToggle.classList.remove("open");
};

export const setCartToLoading = () => {
  const cartContent = document.querySelector("#cartContent");

  cartContent.innerHTML = "";
  cartContent.classList.add("loading");
};

const countLineItems = (lineItems) => {
  let count = 0;

  lineItems.forEach((item) => {
    count += item.quantity;
  });

  return count;
};

export const update = (request) => {
  const cartData = JSON.parse(request.response),
    cartContent = document.querySelector("#cartContent");

  cartContent.classList.remove("loading");

  const newcartContent = renderTemplate(cartContentTemplate(cartData));

  dataBind("cartCount", countLineItems(cartData.lineItems));

  cartContent.appendChild(newcartContent);
};

export const modifyLineItem = (quantity, itemId) => {
  setCartToLoading();

  const body = {
    itemId,
    quantity,
  };

  xhr({
    path: "/shop/modify-line-item",
    body,
    success: update,
  });
};

const modifyLineItemQuantity = (input) => {
  const quantity = input.value,
    itemId = input.dataset.itemId;

  modifyLineItem(quantity, itemId);
};

addEventDelegate("change", ".lineItemQuantity input", modifyLineItemQuantity);

const deleteLineItem = (button) => {
  const itemId = button.dataset.itemId;

  modifyLineItem(0, itemId);
};

addEventDelegate("click", ".deleteLineItem", deleteLineItem);

export const retrieve = () => {
  setCartToLoading();

  xhr({
    path: "/shop/cart",
    success: update,
  });
};

retrieve();

addEventDelegate("click", "#cartClose, #cartOverlay", closeCart);
