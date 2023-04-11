import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";

const changeSlider = (button) => {
  const direction = button.dataset.direction,
    slider = button.parentNode.previousElementSibling;

  if (direction === "next") {
    slide(slider, true);
  } else {
    slide(slider, false);
  }
};

const slide = (slider, forwards) => {
  let activeSlide = parseInt(slider.dataset.active),
    slideCount = parseInt(slider.dataset.count);

  const slides = slider.querySelectorAll(".slide");

  if (forwards) {
    // increase the slide value
    if (activeSlide == slideCount) {
      activeSlide = 0;
    } else {
      activeSlide++;
    }
  } else {
    // decrease the slide value
    if (activeSlide == 0) {
      activeSlide = slideCount;
    } else {
      activeSlide--;
    }
  }

  console.log(activeSlide);

  slider.dataset.active = activeSlide;

  slides.forEach((slide) => {
    const i = slide.dataset.index;

    if (i == activeSlide) {
      slide.dataset.state = "active";
    } else if (i == (activeSlide + 1 > slideCount ? 0 : activeSlide + 1)) {
      slide.dataset.state = "next";
    } else if (i == (activeSlide - 1 < 0 ? slideCount : activeSlide - 1)) {
      slide.dataset.state = "prev";
    } else if (
      i ==
        (activeSlide + 2 > slideCount
          ? activeSlide === slideCount
            ? 1
            : 0
          : activeSlide + 2) &&
      slides.length >= 5
    ) {
      slide.dataset.state = "farNext";
    } else if (
      i ==
        (activeSlide - 2 < 0
          ? slideCount + (activeSlide - 1)
          : activeSlide - 2) &&
      slides.length >= 5
    ) {
      slide.dataset.state = "farPrev";
    } else {
      slide.dataset.state = "inactive";
    }
  });
};

addEventDelegate("click", "button.slider-control", changeSlider);
