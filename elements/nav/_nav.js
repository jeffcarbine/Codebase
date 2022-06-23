/**
 * Navigation
 * Handles the dropdown and toggle behaviors
 * of the navigation
 */

/**
 * Toggle Nav
 * Hides & unhides Toggle Navigations
 *
 * @param {element} target The nav toggle button
 */

function toggleNav(target) {
  // check to see if the toggle-nav is
  // in the "x" (close) state
  if (!target.classList.contains("x")) {
    // if not, add the "x" and
    // open the menu
    target.classList.add("x");
    target.classList.remove("stacked");
    nav.classList.add("open");

    // additional check to see if the
    // nav has the class of "toggle-slideout"
    // in which case, we should add a class
    // to the body
    if (nav.classList.contains("toggle-slideout")) {
      // check to see if we are sliding left
      // or sliding right
      if (nav.classList.contains("right")) {
        body.classList.add("slide-right");
      } else {
        body.classList.add("slide-left");
      }
    }
  } else {
    // otherwise, remove the "x"
    // and close the menu
    target.classList.remove("x");
    target.classList.add("stacked");
    nav.classList.remove("open");

    // additional check to see if the
    // nav has the class of "toggle-slideout"
    // in which case, we should remove a class
    // from the body
    if (nav.classList.contains("toggle-slideout")) {
      // check to see if we are sliding left
      // or sliding right
      if (nav.classList.contains("right")) {
        body.classList.remove("slide-right");
      } else {
        body.classList.remove("slide-left");
      }
    }
  }
}

/**
 * Measure & Remeasure Submenus
 * Measures submenus to allow the styles to animate
 * them opening to exact pixel amounts
 *
 * @param {boolean} remeasure If this is a remeasuring
 * */

var remeasure = ""; // set remeasure variable out here so we can clear it later if needed

function measureSubmenus(remeasure) {
  // start by looping through the submenus
  for (var key in submenus) {
    let submenu = submenus[key];

    // get height and width
    let height = submenu.offsetHeight;
    let width = submenu.offsetWidth;

    // and assign as an inline style
    submenu.style.height = height + "px";
    submenu.style.width = width + "px";

    // then, mark it as measured, and
    // if this isn't a remeasure, give
    // it a collapsed state
    submenu.classList.add("measured");
    if (remeasure !== true) {
      submenu.classList.add("collapsed");
    }
  }
}

function remeasureSubmenus() {
  // clear the remeasure timeout if necessary
  clearTimeout(remeasure);

  let measuredSubmenus = document.querySelectorAll("nav li ul.measured");

  measuredSubmenus.forEach(submenu => {
    // remove measured class
    submenu.classList.remove("measured");

    // and remove the inline styles
    submenu.style.removeProperty("height");
    submenu.style.removeProperty("width");
  });

  // then run the measure function again, but
  // this time pass the remeasure boolean as true
  // so we keep the collapsed states
  // we run it at a delay so that we don't
  // get a seizure-inducing flash of the dropdown
  remeasure = setTimeout(function() {
    measureSubmenus(true);
  }, 100);
}

/**
 * Toggle Submenu
 * Toggle the dropdown menus open and close
 *
 * @param {element} target the submenu
 * */

// whether or not the overflow is on
var overflowOff;

// toggle submenus
function toggleSubmenu(target) {
  // first of all, focus the target
  target.focus();

  // and then get the submenu
  let submenu = target.nextElementSibling;

  // grab the body for later
  let body = document.querySelector("body");

  // we need to get the parent so we can
  // mark the menu item as being open or not
  // for things like carats or styles
  let parent = target.parentNode;

  // we also to see what our
  // transition time is
  let dropdown = target.nextElementSibling;
  let elementStyle = getComputedStyle(dropdown);
  var duration = elementStyle.transitionDuration.replace("s", "") * 1000;

  // borrowed from stackoverflow, using
  // to check if a submenu is nested under
  // another submenu
  function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node !== null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  // second of all, check to see if the
  // submenu has been measured yet
  if (!submenu.classList.contains("measured")) {
    // get height and width
    let height = submenu.offsetHeight;
    let width = submenu.offsetWidth;

    // and assign as an inline style
    submenu.style.height = height + "px";
    submenu.style.width = width + "px";

    submenu.classList.add("measured");
    submenu.classList.add("collapsed");

    setTimeout(function() {
      toggle();
    }, 25);
  } else {
    toggle();
  }

  function toggle() {
    // if thie parent isn't already open
    if (!parent.classList.contains("open")) {
      // make reference to the other open menu items
      let openNavItems = [].slice.call(
        document.querySelectorAll("nav li.open")
      );

      for (i in openNavItems) {
        let openNavItem = openNavItems[i];

        if (!isDescendant(openNavItem, submenu)) {
          openNavItem.classList.remove("open");
          let submenu = openNavItem.querySelector("ul");
          clearTimeout(overflowOff);
          submenu.classList.remove("overflow-off");
          submenu.classList.add("collapsed");
        }
      }

      // now we can mark the parent as open
      parent.classList.add("open");
      // and we can open the submenu
      submenu.classList.remove("collapsed");
      overflowOff = setTimeout(function() {
        submenu.classList.add("overflow-off");
      }, duration);

      // and set the body to the class of nav-open
      body.classList.add("nav-open");
    } else {
      // otherwise, we want to remove the
      // open class from the parent
      parent.classList.remove("open");
      // and we want to collapse the submenu
      let submenu = parent.querySelector("ul");
      clearTimeout(overflowOff);
      submenu.classList.remove("overflow-off");
      submenu.classList.add("collapsed");

      // if this submenu contains any children submenus,
      // we want to collapse them at the same time too
      let nestedOpenNavItems = [].slice.call(
        submenu.querySelectorAll("li.open")
      );
      if (nestedOpenNavItems.length > 0) {
        for (e in nestedOpenNavItems) {
          let nestedOpenNavItem = nestedOpenNavItem[e];

          nestedOpenNavItem.classList.remove("open");

          let menu = nestedOpenNavItem.querySelector("ul");
          menu.classList.add("collapsed");
        }
      }

      // and remove the class of nav-open from the body
      body.classList.remove("nav-open");
    }
  }
}

// this close function is run for both the
// anchor link click as well as clicking anywhere
// that isn't the nav when the nav is open
function closeNav() {
  // remove x from toggle-nav
  let toggleNav = document.querySelector("#toggle-nav");
  toggleNav.classList.remove("x");

  // remove open class from nav
  nav.classList.remove("open");

  // remove slide classes from body
  let body = document.querySelector("body");
  body.classList.remove("slide-left");
  body.classList.remove("slide-right");

  // and remove nav-open from the body
  body.classList.remove("nav-open");

  // and we can remove the open class from
  // the open menu items
  let openNavItems = [].slice.call(nav.querySelectorAll("li.open"));

  for (x in openNavItems) {
    let openNavItem = openNavItems[x];

    openNavItem.classList.remove("open");

    // and we can collapse their submenus
    let submenu = openNavItem.querySelector("ul");
    clearTimeout(overflowOff);
    submenu.classList.remove("overflow-off");
    submenu.classList.add("collapsed");
  }
}

// close nav by clicking anywhere else
function closeMenu(target) {
  // this will check whether the target is
  // the nav or the toggle-nav
  function checkTarget(target) {
    if (target.matches("nav") || target.matches("#toggle-nav")) {
      // it is a navbar
      return false;
    } else {
      // if we haven't hit the body yet,
      // go one level up and check again
      if (!target.matches("body")) {
        checkTarget(target.parentNode);
      } else {
        // we can successfully close the menu
        closeNav();
      }
    }
  }

  // now you can start this function by
  // running the checkTarget function
  checkTarget(target);
}

function stickyNav() {
  // first, make sure we are on
  // desktop by checking for the
  // toggle-nav style

  let toggle = document.querySelector("#toggle-nav");
  let isDesktop = window.getComputedStyle(toggle).display === "none";

  if (isDesktop) {
    let scroll = window.scrollY;

    if (scroll > navPosition) {
      nav.classList.add("sticky-active");
      dummy.style.height = navHeight + "px";
    } else {
      nav.classList.remove("sticky-active");
      dummy.style.height = "auto";
    }
  } else {
    dummy.style.height = "auto";
    nav.classList.remove("sticky-active");
  }
}

var navPosition;
var navHeight;

function getNavParams() {
  navPosition =
    nav.getBoundingClientRect().top +
    (window.pageYOffset || document.documentElement.scrollTop);
  navHeight = nav.offsetHeight;
}

function initStickyNav() {
  // create the dummy element
  //////////////
  // STICKY NAV
  //////////////

  let dummy = document.createElement("div");
  dummy.classList.add("nav-dummy");
  dummy.style.display = "block";
  nav.parentNode.insertBefore(dummy, nav);

  getNavParams();

  window.addEventListener("scroll", function() {
    stickyNav();
  });
}

var submenus;

function setupNav(nav) {
  if (nav.dataset.initialized === undefined) {
    submenus = [].slice.call(document.querySelectorAll("nav li ul"));

    addEventDelegate("click", "#toggle-nav", toggleNav);

    // when the page resizes, the submenu height
    // might change, so we need to resize it

    // save this to the onresizeFunctions
    addEventDelegate("resize", window, remeasureSubmenus);

    // set toggle to click
    addEventDelegate("click", "nav li button", toggleSubmenu);

    // if the hover class is on the nav, then we
    // need to add a hover event for the
    // toggle submenu - we can handle this just
    // with a simple event listener

    // get all the main nav buttons
    let mainNavItems = document.querySelectorAll("nav > ul > li");

    for (var i = 0; i < mainNavItems.length; i++) {
      let mainNavItem = mainNavItems[i];
      mainNavItem.addEventListener("mouseover", function() {
        // get reference to navToggle so we can tell if
        // we are in a touch environment or not
        let navToggle = document.querySelector("#nav-toggle");

        let isOpen = mainNavItem.classList.contains("open") ? true : false;

        if (nav.classList.contains("hover") && navToggle === null && !isOpen) {
          let mainNavButton = mainNavItem.querySelector("button");
          toggleSubmenu(mainNavButton);
        }
      });
    }

    // we need to close the menu whenever
    // an anchor nav item is clicked on
    // that is a hash value and not a URL.
    // since we need this to happen based
    // on the href value of a nav item, we
    // have to bind an event listener to it
    // instead of using delegate.click

    // loop through the anchorlinks
    let navAnchorLinks = nav.querySelectorAll('a[href^="#"]');

    for (var z = 0; z < navAnchorLinks.length; z++) {
      let item = navAnchorLinks[z];
      // add an eventlistener to each of them
      item.addEventListener("click", function() {
        // close the menu
        close();
      });
    }

    addEventDelegate("click", "*:not(nav)", closeMenu, false);

    if (nav.classList.contains("sticky")) {
      initStickyNav();
    }

    addEventDelegate("resize", window, getNavParams);

    nav.dataset.initialized = true;

    removeEventDelegate("mouseover", "nav");
  }
}

addEventDelegate("mouseover", "nav", setupNav);
