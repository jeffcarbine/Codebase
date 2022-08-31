/**
 * Toggle Accordions
 * This toggles the accordion open and closed.
 * If it is the first time an accordion is opened, it will also measure the accordion so it animates to the correct height.
 * If it is the first time any accordion is opened, it will also create the event delegate for remeasuring the measured accordion heights.
 *
 * @param {element} target the accorion opening button
 */

function toggleAccordion(target) {
  // the body of the accordion always follow right after the button
  let accordionBody = target.nextElementSibling;

  // check to see whether or not the it is open
  if (!accordionBody.classList.contains("open")) {
    // create the function to handle opening the accordion
    let openAccordionBody = function () {
      accordionBody.classList.add("open");
    };

    // we need to add the delegate to listen for resizing
    // after the first accordion is opened
    if (!accordionsToRemeasure) {
      console.log("time to remeasure accordions!");
      addEventDelegate(
        "resize, orientationchange",
        window,
        remeasureAccordions
      );

      // prevent it from doing it again after this one time
      accordionsToRemeasure = true;
    }

    // if this is the first time, there is a 50ms delay
    // while we measure the accordion-body
    if (!accordionBody.classList.contains("measured")) {
      // get height
      let height = accordionBody.offsetHeight + "px";
      accordionBody.style.height = height;

      // add class of measured
      accordionBody.classList.add("measured");

      // and open after 50ms timeout
      setTimeout(function () {
        openAccordionBody();
      }, 50);
    } else {
      // otherwise, we just open it
      openAccordionBody();
    }
  } else {
    // or we just close the accordion
    accordionBody.classList.remove("open");
  }
}

// event for opening the accordion via the .toggle element
addEventDelegate("click", ".accordion .toggle", toggleAccordion);

// whether or not we should start remeasuring
let accordionsToRemeasure = false;

/**
 * Remeasure Accordions
 * This remeasures all the currently measured accordions whenever the screen is resized or orientation is changed.
 */

function remeasureAccordions() {
  // get all the measured accordion-body elements
  let accordionBodies = document.querySelectorAll(".accordion-body.measured");

  // loop through them
  accordionBodies.forEach(function (accordionBody) {
    // remove the measured class so we can get it into a measurable state
    accordionBody.classList.remove("measured");

    // remove the inline height
    accordionBody.style.removeProperty("height");

    // and recalculate it
    let height = accordionBody.offsetHeight + "px";
    accordionBody.style.height = height;

    // add the measured class after a 50ms timeout
    setTimeout(function () {
      accordionBody.classList.add("measured");
    }, 50);
  });
}
