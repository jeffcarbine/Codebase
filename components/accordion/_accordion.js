import { addEventDelegate } from "../../scripts/eventdelegate/_eventdelegate.js";
import { smoothScroll } from "../../scripts/smoothscroll/_smoothscroll.js";

/**
 * Toggle Accordions
 * This toggles the accordion open and closed.
 * If it is the first time an accordion is opened, it will also measure the accordion so it animates to the correct height.
 * If it is the first time any accordion is opened, it will also create the event delegate for remeasuring the measured accordion heights.
 *
 * @param {element} target the accorion opening button
 */

export const handleAccordionClick = (target) => {
  // the body of the accordion always follow right after the button
  const accordionBody = target.nextElementSibling;

  toggleAccordion(accordionBody, target);
};

const toggleAccordion = (accordionBody, accordionButton, callback) => {
  // check to see whether or not the it is open
  if (!accordionBody.classList.contains("open")) {
    const height = accordionBody.offsetHeight,
      transitionDuration = getComputedStyle(accordionBody).getPropertyValue(
        "transition-duration"
      ),
      delay = parseFloat(transitionDuration.replace("s", "")) * 1000;

    // now set a 10ms timeout so we can add the height inline and then
    // transition to the height px value

    accordionBody.classList.add("open");
    accordionButton.classList.add("open");

    setTimeout(() => {
      accordionBody.style.height = height + "px";
    }, 10);

    // and after the transition duration, change the inline
    // height to "auto" so that we aren't stuck at a pixel height
    setTimeout(() => {
      accordionBody.style.height = "auto";
    }, delay);
  } else {
    closeAccordion(accordionBody, accordionButton);
  }
};

const closeAccordion = (accordionBody, accordionButton) => {
  const height = accordionBody.offsetHeight,
    transitionDuration = getComputedStyle(accordionBody).getPropertyValue(
      "transition-duration"
    ),
    delay = parseFloat(transitionDuration.replace("s", "")) * 1000;

  // set the accordion's height back to it's precise pixel amount
  accordionBody.style.height = height + "px";

  // then after a short timeout, set it to null so as
  // to trigger the transition
  setTimeout(() => {
    accordionBody.style.height = null;
  }, 10);

  // and then after the transition duration, remove the open
  // class from the accordion-body
  setTimeout(() => {
    accordionBody.classList.remove("open");
    accordionButton.classList.remove("open");
  }, delay);
};

// export for use in typescript
export { toggleAccordion, closeAccordion };

// // event for opening the accordion via the .toggle element
addEventDelegate("click", ".accordion .toggle", handleAccordionClick);

// automatically expand the accordion that matches the hash
const params = new URLSearchParams(window.location.search),
  openAccordionHash = params.get("openaccordion");

if (openAccordionHash !== null) {
  const openAccordion = document.querySelector(
    ".accordion#" + openAccordionHash
  );

  // delay to illustate the location of the faq
  setTimeout(() => {
    smoothScroll("#" + openAccordionHash);

    // and then open the accordion
    setTimeout(() => {
      const accordionButton = openAccordion.querySelector("button");
      handleAccordionClick(accordionButton);

      // and give the accordion a highlighted class
      openAccordion.classList.add("highlighted");
    }, 500);
  }, 500);
}
