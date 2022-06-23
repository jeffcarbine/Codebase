let slideIndex = 0;

let carousels = {};

function buildCarousel(target) {
  /*
     * --hideArrows
     * --hideBreadcrumbs
     * --arrowsInSlide
     * --autoplay
     * --hoverpause
     *  
     */

  // build our parameters
  let params = {
    arrowsInSlide: false,
    hoverpause: true
  };

  let classList = target.classList;

  loop(classList, function(str) {
    if (str.startsWith("--")) {
      verifyParam(str);
    }
  });

  function verifyParam(str) {
    // split it into parameter
    // name and value, if there
    // is one
    let param = str.replace("--", "");
    var name;
    var value;

    if (param.indexOf("=") > -1) {
      name = param.split("=")[0];
      value = param.split("=")[1];
    } else {
      name = param;
      value = true;
    }

    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }

    params[name] = value;
  }

  // get our carousel
  let carousel = target;

  // tag this with an id indicating the
  // slide number it is
  let carouselId = "carousel" + slideIndex;
  carousel.id += carouselId;
  slideIndex++;

  // set up our params
  let showArrows = params.showArrows !== false ? true : false;
  let showBreadcrumbs = params.showBreadcrumbs !== false ? true : false;
  let arrowContainer = params.arrowsInSlide;
  if (params.arrowsInSlide !== false) {
    let checkContainer = carousel.querySelector("." + params.arrowsInSlide);

    if (checkContainer !== null) {
      arrowContainer = "." + params.arrowsInSlide;
    } else {
      console.warn(
        "The target passed in the arrowsInSlide parameter of the buildCarousel function for " +
          carouselId +
          " is not a valid selector."
      );
    }
  }

  // build the track
  let carouselTrack = document.createElement("div");
  carouselTrack.className = "carousel-track glide__track";
  carouselTrack.dataset.glideEl = "track";

  // build the slides ul
  let carouselSlides = document.createElement("ul");
  carouselSlides.className = "carousel-slides glide__slides";
  // and append it to the track
  carouselTrack.appendChild(carouselSlides);

  // grab all the immediate children
  let children = carousel.children;

  var carouselBreadcrumbs;
  if (showBreadcrumbs) {
    // create the bradcrumb container
    carouselBreadcrumbs = document.createElement("div");
    carouselBreadcrumbs.classList.add("carousel-breadcrumbs");
  }

  // stuff the children into the new container
  loop(children, function(child, i) {
    // create an li for the slides ul
    let slide = document.createElement("li");
    slide.innerHTML = child.innerHTML;
    slide.className = child.className + " slide slide" + i + " glide__slide";

    if (arrowContainer !== false) {
      let slideArrowContainer = slide.querySelector(arrowContainer);
      if (showArrows) {
        // first, check the params for an arrow
        // icon, otherwise use our default icons
        let arrowIcon = "chevron";
        if (params !== undefined && params.arrowIcon !== undefined) {
          switch (params.arrowIcon) {
            case "chevron-small":
              arrowIcon = "chevron-small";
              break;
            case "arrow":
              arrowIcon = "arrow";
              break;
            case "arrow-small":
              arrowIcon = "arrow-small";
              break;
            default:
              arrowIcon = "chevron";
              break;
          }
        }

        let carouselArrows = document.createElement("div");
        carouselArrows.className = "carousel-arrows";

        let arrowLeft = document.createElement("button");
        arrowLeft.className = "arrow";
        arrowLeft.dataset.icon = arrowIcon + "-left";
        arrowLeft.dataset.slideTo = "left";
        arrowLeft.dataset.carouselId = carouselId;
        carouselArrows.appendChild(arrowLeft);

        let arrowRight = document.createElement("button");
        arrowRight.className = "arrow";
        arrowRight.dataset.icon = arrowIcon + "-right";
        arrowRight.dataset.slideTo = "right";
        arrowRight.dataset.carouselId = carouselId;
        carouselArrows.appendChild(arrowRight);

        //if (i !== 0) {
        //    arrowLeft.disabled = true;
        //    arrowRight.disabled = true;
        //}

        // and append the arrows
        slideArrowContainer.appendChild(carouselArrows);
      }
    }

    // add li to the slides ul
    carouselSlides.appendChild(slide);

    // make the breadcrumb
    var breadcrumb;
    if (showBreadcrumbs) {
      breadcrumb = document.createElement("button");
      breadcrumb.className = "breadcrumb";
      // mark as first if it is the first
      if (i === 0) {
        breadcrumb.classList.add("active");
      }
      breadcrumb.dataset.slide = i;
      breadcrumb.dataset.carouselId = carouselId;
      carouselBreadcrumbs.appendChild(breadcrumb);
    }
  });

  // now that the new children are created, we can
  // empty out the carousel and start appending our
  // new markup
  carousel.innerHTML = "";

  // append the carouselTrack
  carousel.appendChild(carouselTrack);

  if (showBreadcrumbs) {
    // and then the breadcrumbs
    carousel.appendChild(carouselBreadcrumbs);
  }

  //////////
  // ARROWS
  //////////

  if (showArrows && arrowContainer === false) {
    // first, check the params for an arrow
    // icon, otherwise use our default icons
    let arrowIcon = "chevron";
    if (params !== undefined && params.arrowIcon !== undefined) {
      switch (params.arrowIcon) {
        case "chevron-small":
          arrowIcon = "chevron-small";
          break;
        case "arrow":
          arrowIcon = "arrow";
          break;
        case "arrow-small":
          arrowIcon = "arrow-small";
          break;
        default:
          arrowIcon = "chevron";
          break;
      }
    }

    let carouselArrows = document.createElement("div");
    carouselArrows.className = "carousel-arrows";

    let arrowLeft = document.createElement("button");
    arrowLeft.className = "arrow";
    arrowLeft.dataset.icon = arrowIcon + "-left";
    arrowLeft.dataset.slideTo = "left";
    arrowLeft.dataset.carouselId = carouselId;
    carouselArrows.appendChild(arrowLeft);

    let arrowRight = document.createElement("button");
    arrowRight.className = "arrow";
    arrowRight.dataset.icon = arrowIcon + "-right";
    arrowRight.dataset.slideTo = "right";
    arrowRight.dataset.carouselId = carouselId;
    carouselArrows.appendChild(arrowRight);

    // and append the arrows
    carousel.appendChild(carouselArrows);
  }

  // now generate the glider
  carousels[carouselId] = new Glide("#" + carouselId, params).mount();

  carousels[carouselId].on("run", function() {
    // keep breadcrumbs up-to-date
    if (showBreadcrumbs) {
      let carousel = document.querySelector("#" + carouselId);
      let activeBreadcrumb = carousel.querySelector(".breadcrumb.active");
      activeBreadcrumb.classList.remove("active");

      let index = carousels[carouselId].index;
      let newActiveBreadcrumb = carousel.querySelector(
        ".breadcrumb[data-slide='" + index + "']"
      );
      newActiveBreadcrumb.classList.add("active");
    }

    //// enable/disable/focus contained arrow buttons
    //if (arrowContainer !== false) {
    //    //
    //}
  });

  // generate the icons because for some
  // reason our delegate can't reach it here
  generateIcons();

  carousel.classList.add("initialized");
}

function moveCarousel(button) {
  // first, get the id of this carousel
  let carouselId = button.dataset.carouselId;

  // check to see if we are an
  // arrow or a breadcrumb
  let isArrow = button.classList.contains("arrow") ? true : false;
  let isBreadcrumb = !isArrow ? true : false;

  if (isArrow) {
    // get direction
    let slideTo = button.dataset.slideTo;

    if (button.disabled !== true) {
      if (slideTo === "left") {
        carousels[carouselId].go("<");
      } else if (slideTo === "right") {
        carousels[carouselId].go(">");
      }
    }
  }

  if (isBreadcrumb) {
    carousels[carouselId].go("=" + button.dataset.slide);
  }
}

addEventDelegate(
  "click",
  ".carousel-breadcrumbs button, .carousel-arrows button",
  moveCarousel
);

function buildCarousels() {
  let carousels = document.querySelectorAll(".carousel");

  loop(carousels, function(carousel) {
    buildCarousel(carousel);
  });
}

addEventDelegate("load", window, buildCarousels);

//addEventDelegate("childList", ".carousel:not(.initialized)", buildCarousel);
