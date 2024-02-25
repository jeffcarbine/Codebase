import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

const checkLazyImages = () => {
  const lazyImages = document.querySelectorAll(
    "[data-component=lazyImg][data-src]"
  );

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  lazyImages.forEach((image) => {
    if (isElementInViewport(image)) {
      image.src = image.getAttribute("data-src");
      image.removeAttribute("data-src");
    }
  });
};

checkLazyImages();

addEventDelegate("scroll", window, checkLazyImages);
