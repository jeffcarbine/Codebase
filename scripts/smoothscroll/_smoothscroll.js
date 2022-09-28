import { addEventDelegate } from "../../scripts/eventdelegate/_eventdelegate.js";

/**
 * Smooth Scroll Click
 * Handles intercepting link clicks with hash hrefs
 * @param {node} link the link that contains the hash href
 */
function smoothScrollClick(link) {
  // get the href attribute of the link
  let hash = link.getAttribute("href");

  // and scroll to it
  smoothScroll(hash);
}

/**
 * Smooth Scroll
 * Handles scrolling to the correct position
 * @param {string} hash the id that we are scrolling to
 */
export const smoothScroll = (hash) => {
  console.log("should be scrolling...");
  // check to see if the hash contains letters
  // (ie: its a valid id selector)
  if (hash.match(/[a-z]/i)) {
    // we need to figure out what the scrollable
    // dom element is. we do this by
    // working our way up the parentnodes
    // until we find a parent that has
    // overflow-y set to scroll or we hit
    // the window

    let target = document.querySelector(hash);
    console.log(target);

    // now check to see that the target is defined
    // (ie: the element we want to scroll to actually exists)
    if (target !== undefined && target !== null) {
      const scrollOffset = target.dataset.scrolloffset || 0,
        // figure out what the parent is
        scrollParent = getScrollParent(target);

      let targetPosition = target.offsetTop,
        parentOffset = scrollParent.offsetTop || 0,
        offsetPosition = targetPosition - parentOffset - scrollOffset;

      // if window, then do window
      if (scrollParent === window) {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else {
        // otherwise, do scrollParent
        scrollParent.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }
};

/**
 * Get Scroll Parent
 * This gets the parent of the element we are trying to scroll to in the
 * event that the element is inside of its own scrollable container and
 * not just in the main body
 *
 * @param {node} target The element on screen that we are trying to scroll to
 */

// empty scrollParent variable that gets set by
// the getScrollParent function and is read in the
// main function

function getScrollParent(target) {
  let parent = target.parentNode;

  // if the parent is the document, then
  // parent is actually the window
  if (parent === document) {
    return window;
  } else if (
    // check that the parent doesn't have an overflowY scroll value
    parent !== document &&
    window.getComputedStyle(parent).overflowY !== "scroll"
  ) {
    // if so, run this again on the parent
    return getScrollParent(parent);
  } else {
    // we've found the parent
    return parent;
  }
}

// and set the event delegate
addEventDelegate("click", "a[href^='#']", smoothScrollClick);

// smooth-scroll with query selector instead of hash
const params = new URLSearchParams(window.location.search),
  hash = params.get("scrollto");

setTimeout(() => {
  smoothScroll("#" + hash);
}, 500);
