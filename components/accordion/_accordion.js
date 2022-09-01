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

  const height = accordionBody.offsetHeight,
    transitionDuration = getComputedStyle(accordionBody).getPropertyValue(
      "transition-duration"
    ),
    delay = parseFloat(transitionDuration.replace("s", "")) * 1000;

  // check to see whether or not the it is open
  if (!accordionBody.classList.contains("open")) {
    // now set a 10ms timeout so we can add the height inline and then
    // transition to the height px value

    accordionBody.classList.add("open");

    setTimeout(() => {
      accordionBody.style.height = height + "px";
    }, 10);

    // and after the transition duration, change the inline
    // height to "auto" so that we aren't stuck at a pixel height
    setTimeout(() => {
      accordionBody.style.height = "auto";
    }, delay);
  } else {
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
    }, delay);
  }
}

// event for opening the accordion via the .toggle element
addEventDelegate("click", ".accordion .toggle", toggleAccordion);
