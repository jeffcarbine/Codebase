import * as e from "../../elements/elements.js";

export const sliderTemplate = (slideElements, preSlides = null) => {
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
    }

    const slide = new e.LI({
      class: "slide",
      "data-index": i,
      "data-state": state,
      child: slideElement,
    });

    slides.push(slide);
  }

  children.push(
    new e.UL({
      class: "slides",
      "data-count": slides.length - 1, // to account for zero-index
      "data-active": 0,
      children: slides,
    })
  );

  children.push({
    class: "slider-controls",
    children: [
      new e.BUTTON({
        class: "slider-control prev",
        "aria-label": "Next",
        "data-direction": "next",
      }),
      new e.BUTTON({
        class: "slider-control next",
        "aria-label": "Prev",
        "data-direction": "prev",
      }),
    ],
  });

  return {
    class: "slider",
    children,
  };
};
