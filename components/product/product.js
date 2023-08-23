import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

const highlightProductImage = (radio) => {
  const imageid = radio.dataset.imageid;

  // find this image
  const productImage = document.querySelector("#" + imageid),
    productImageIndex = productImage.parentNode.dataset.index;

  // set the slider to that active slide
  const slides = document.querySelector(".slider .slides");
  slides.dataset.active = productImageIndex;
};

export const delegate = () => {
  addEventDelegate("input", "input[name='variant']", highlightProductImage);
};
