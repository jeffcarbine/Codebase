/**
 * Scrollspy
 * Logic for how the scrollspy stays in sync with
 * the element that is being scrolled
 */

/**
 * Initialize Scrollspy
 * Since scroll events can't be delegated, we have to
 * initialize the scrollspy's scroll event here
 */

// this is the universal function that will initialize all the
// scrollspies on the page, if any.
let scrollspiesInitialized = false;

function initializeScrollspies() {
  if (!scrollspiesInitialized) {
    let scrollspies = document.querySelectorAll(".scrollspy");

    if (scrollspies.length > 0) {
      loop(scrollspies, function(scrollspy, index) {
        initializeScrollspy(scrollspy, index);
      });

      scrollspiesInitialized = true;
    }
  }
}

// global array that holds the scrollspy's offset
let scrollspies = [];

// this is the function that initizalizes the individual scrollspy as
// either passed from initializeScrollspies or via a childList event
function initializeScrollspy(scrollspy, index) {
  // first, create a unique identifier for the scrollspy
  let now = new Date();
  let uniqueId = "_" + now.getTime();
  scrollspy.id += uniqueId;

  // determine whether the scrollarea is the window or a scrollable element
  let scrollArea =
    scrollspy.dataset.spy === "window"
      ? window
      : document.querySelector(scrollspy.dataset.spy);

  let spyItems = scrollspy.querySelectorAll("li");

  setScrollspyStops(scrollspy, index);

  // generate the mobile scrollspy accordion button
  let button = document.createElement("button");
  button.className = "scrollspy-btn";
  button.innerHTML = iconList["bars-small"];
  button.setAttribute("aria-label", "Open Navigation");
  button.dataset.scrollspy = uniqueId;
  setTimeout(function() {
    // forcing it to wait so it is caught by the mutation observer
    scrollspy.parentNode.insertBefore(button, scrollspy.nextSibling);
  }, 250);

  spyItems[0].classList.add("active");

  scrollArea.addEventListener("scroll", function() {
    var position;

    if (scrollArea === window) {
      position = window.scrollY;
    } else {
      position = scrollArea.scrollTop;
    }

    var activeSpy = scrollspy.querySelector(".active") || false;

    if (position > spyItems[0].dataset.stop) {
      // iterate over every stop
      for (var r = 0; r < spyItems.length; r++) {
        let spyItem = spyItems[r];
        let stop = parseInt(spyItem.dataset.stop);

        if (!(position >= stop)) {
          // first, remove the active class from the current active element
          if (activeSpy) {
            scrollspy.querySelector(".active").classList.remove("active");
          }

          // then we have found the first stop that we
          // aren't greater than, so we need to mark the
          // previous spyItem as the active one
          let prevSpyItem = spyItems[r - 1];
          prevSpyItem.classList.add("active");
          smoothScroll("#" + prevSpyItem.id);

          break;
        }

        if (r === spyItems.length - 1) {
          // first, remove the active class from the current active element
          if (activeSpy) {
            scrollspy.querySelector(".active").classList.remove("active");
          }

          // then we need to highlight the last item
          let prevSpyItem = spyItems[spyItems.length - 1];
          prevSpyItem.classList.add("active");
          smoothScroll("#" + prevSpyItem.id);
        }
      }
    }

    // we also now need to check if the scrollspy is
    // a child of the element it is spying on - if so,
    // then we need to add the padding-top to have it scroll
    // along with the content
    var scrollspyContained;

    if (scrollArea === window) {
      scrollspyContained = true;
    } else {
      scrollspyContained = scrollArea.contains(scrollspy);
    }

    if (scrollspyContained) {
      // then we need to add padding-top to the
      // the scrollspy
      if (window.innerWidth > 960) {
        let scrollspyOffset = scrollspies[index];

        if (position > scrollspyOffset) {
          // here we need to check if the footer is visible on window scrollspy
          // so we don't push the scrollspy past the bottom of the scrollable area
          let footerVisible =
            footer.getBoundingClientRect().top < window.innerHeight;

          if (!footerVisible) {
            let offset = position - scrollspyOffset;
            scrollspy.style.transform = "translateY(" + offset + "px)";
          }
        } else {
          scrollspy.style.transform = "translateY(0px)";
        }
      } else {
        scrollspy.style.transform = "translateY(0px)";
      }
    }
  });

  scrollspy.classList.add("scrollspy-initialized");
}

function setScrollspyStops(scrollspy, index) {
  // first, set the top offset for this scrollspy
  scrollspies[index] = scrollspy.getBoundingClientRect().top;

  let spyItems = scrollspy.querySelectorAll("li");

  loop(spyItems, function(spyItem) {
    let anchor = spyItem.querySelector("a");
    let id = anchor.href.split("#")[1];
    let stop = document.querySelector("#" + id);
    let stopOffset = stop.offsetTop - 100;

    // store the stop as a data attribute on the spyitem
    spyItem.dataset.stop = stopOffset;

    // add our own anchor to the spy item
    spyItem.id = "spy-item-" + id;
  });
}

function resetScrollspyStops() {
  setTimeout(function() {
    let scrollspies = document.querySelectorAll(".scrollspy");

    loop(scrollspies, function(scrollspy, index) {
      setScrollspyStops(scrollspy, index);
    });
  }, 500);
}

function toggleScrollspy(button) {
  let scrollspyId = button.dataset.scrollspy;
  let scrollspy = document.getElementById(scrollspyId);

  if (scrollspy.classList.contains("open")) {
    scrollspy.classList.remove("open");
  } else {
    scrollspy.classList.add("open");
  }
}

addEventDelegate("load", window, initializeScrollspies);
//addEventDelegate(
//  "childList",
//  ".scrollspy:not(.scrollspy-initialized)",
//  initializeScrollspy
//);
addEventDelegate("resize", window, resetScrollspyStops);
addEventDelegate("click", "button.scrollspy-btn", toggleScrollspy);
