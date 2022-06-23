function scrollShadow(target, beforeShadow, afterShadow) {
    // get current scroll position
    let scroll = target.scrollTop;

    // get full height of container
    let height = target.scrollHeight - target.offsetHeight - 50;

    // if we are scrolled all the way to the top
    if (scroll <= 50) {
        beforeShadow.classList.remove("active");
        afterShadow.classList.remove("inactive");
    }

    // if we are somewhere in the middle
    else if (scroll > 0 && scroll < height) {
        beforeShadow.classList.add("active");
        afterShadow.classList.remove("inactive");
    }

    // if we are at the bottom
    else if (scroll >= height) {
        beforeShadow.classList.add("active");
        afterShadow.classList.add("inactive");
    }
}

function checkScrollShadow(target, beforeShadow, afterShadow) {
    let scrollHeight = target.scrollHeight;
    let offsetHeight = target.offsetHeight;

    if (offsetHeight < scrollHeight) {
        // then they don't need to be disabled
        beforeShadow.classList.remove("disabled");
        afterShadow.classList.remove("disabled");
    } else {
        beforeShadow.classList.add("disabled");
        afterShadow.classList.add("disabled");
    }
}

function registerScrollShadow(target) {
    // check if the scrollshadow even needs to be initialized
    let scrollHeight = target.scrollHeight;
    let offsetHeight = target.offsetHeight;

    if (offsetHeight < scrollHeight) {
        // create the before and after
        let beforeShadow = document.createElement("div");
        beforeShadow.classList.add("before-shadow");
        let afterShadow = document.createElement("div");
        afterShadow.classList.add("after-shadow");

        let parent = target.parentNode;
        parent.insertBefore(beforeShadow, target);
        parent.insertBefore(afterShadow, target.nextSibling);

        target.classList.add("initialized");

        target.addEventListener("scroll", function () {
            scrollShadow(this, beforeShadow, afterShadow);
        });

        window.addEventListener("resize", function () {
            checkScrollShadow(target, beforeShadow, afterShadow);
        });

        window.addEventListener("orientationchange", function () {
            checkScrollShadow(target, beforeShadow, afterShadow);
        });
    }
}

addEventDelegate("mouseover touchstart mutation", ".scrollshadow:not(.initialized)", registerScrollShadow);

