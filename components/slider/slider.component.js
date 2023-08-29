import { UL, LI, BUTTON } from "../../elements/elements.js";

export const SLIDER = (slideElements, preSlides = null) => {
  const slides = [],
    children = [];

  if (preSlides !== null) {
    children.push(preSlides);
  }

  for (let i = 0; i < slideElements.length; i++) {
    const slideElement = slideElements[i];

    // all sliders default state is zero, so
    // we calculate the slide's state based on that
    let state = "inactive";

    if (i === 0) {
      state = "active";
    } else if (i === 1) {
      state = "next";
    } else if (i === slideElements.length - 1) {
      state = "prev";
    } else if (i === 2 && slideElements.length >= 5) {
      state = "farNext";
    } else if (i === slideElements.length - 2 && slideElements.length >= 5) {
      state = "farPrev";
    } else if (i === 3 && slideElements.length >= 7) {
      state = "farFarNext";
    } else if (i === slideElements.length - 3 && slideElements.length >= 7) {
      state = "farFarPrev";
    }

    const slide = new LI({
      class: "slide",
      "data-index": i,
      "data-state": state,
      child: slideElement,
    });

    slides.push(slide);
  }

  children.push(
    new UL({
      class: "slides",
      "data-count": slides.length - 1, // to account for zero-index
      "data-active": 0,
      children: slides,
    })
  );

  if (slideElements.length > 1) {
    children.push({
      class: "slider-controls",
      children: [
        new BUTTON({
          class: "slider-control prev",
          "aria-label": "Next",
          "data-direction": "next",
        }),
        new BUTTON({
          class: "slider-control next",
          "aria-label": "Prev",
          "data-direction": "prev",
        }),
      ],
    });
  }

  return {
    class: "slider",
    children,
  };
};
