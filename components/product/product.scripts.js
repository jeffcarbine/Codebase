import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr } from "../../modules/xhr/xhr.js";
import { setCartToLoading, update } from "../cart/cart.scripts.js";

const addToCart = (button) => {
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
    cartToggle.click();

    button.classList.remove("loading");
    update(request);
  };

  xhr({
    path: "/shop/add-to-cart",
    body: { variantId },
    success,
  });
};

addEventDelegate("click", "#addToCart", addToCart);

const highlightProductImage = (radio) => {
  const imageid = radio.dataset.imageid;

  // find this image
  const productImage = document.querySelector("#" + imageid),
    productImageIndex = productImage.parentNode.dataset.index;

  // set the slider to that active slide
  const slides = document.querySelector(".slider .slides");
  slides.dataset.active = productImageIndex;
};

addEventDelegate("input", "input[name='variant']", highlightProductImage);
