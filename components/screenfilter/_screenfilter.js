/**
 * Toggle help bubble on or off
 * @param {node} target the helpbubble
 * @param {event} event the event triggering this function
 */
function toggleIconBubble(target, event) {
  // get the actual bubble from the component
  let bubble = target.querySelector(".bubble");

  // if a click, run the toggleClick function
  if (event.type === "click") {
    toggleClick(bubble);
  }

  // if a hover event, run the toggleHover function
  if (event.type === "mouseover") {
    toggleHover(true, bubble);
  }

  if (event.type === "mouseout") {
    toggleHover(false, bubble);
  }

  // toggle clicked class
  const toggleClick = function (bubble) {
    // if it has the class of clicked, remove it
    if (bubble.classList.contains("clicked")) {
      bubble.classList.remove("clicked");
    } else {
      // otherwise, add it
      bubble.classList.add("clicked");
    }

    // check the position of the helpbubble on the screen
    checkPosition(bubble);
  };

  // toggle hovered class
  const toggleHover = function (hovering, bubble) {
    // hovering bool passed by main function as to whether
    // this is a mouseover or mouseout event
    // and we add/remove the class as needed
    if (hovering) {
      bubble.classList.add("hovering");
    } else {
      bubble.classList.remove("hovering");
    }

    // check the position of the helpbubble on the screen
    checkPosition(bubble);
  };

  // check whether we're on the left or right side of the screen so
  // we can render the bubble pointing the right direction
  const checkPosition = function (bubble) {
    // get the x position of the helpbubble
    const xPos = target.getBoundingClientRect().left,
      // check the window width
      windowWidth = window.innerWidth,
      // split it in half to tell when we've crossed the middle line
      limit = windowWidth / 2;

    // if we're greater than the liimt...
    if (xPos > limit) {
      // it's on the left
      bubble.classList.add("left");
      bubble.classList.remove("right");
    } else {
      // otherwise it's on the right
      bubble.classList.add("right");
      bubble.classList.remove("left");
    }
  };
}

// register the delegate
addEventDelegate(
  "click mouseover mouseout",
  ".helpbubble button",
  toggleIconBubble
);
