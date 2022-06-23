/**
 * Dropdown
 * This handles the opening and closing of dropdowns
 */

let dropdownOperation = false;

function toggleDropdown(button) {
  let dropdownBody = button.nextElementSibling;

  if (!dropdownOperation) {
    dropdownOperation = true;

    if (dropdownBody.classList.contains("collapsed")) {
      button.classList.add("open");

      // preemptively remove any styles so that the measurement
      // is good
      dropdownBody.removeAttribute("style");

      let height = dropdownBody.offsetHeight;
      dropdownBody.style.height = height + "px";
      dropdownBody.classList.add("measured");

      setTimeout(function () {
        dropdownBody.classList.remove("collapsed");
      }, 50);
    } else {
      button.classList.remove("open");

      dropdownBody.classList.add("collapsed");

      setTimeout(function () {
        dropdownBody.classList.remove("measured");
      }, 500);
    }

    setTimeout(function () {
      dropdownOperation = false;
    }, 500);
  }
}

addEventDelegate("click", ".dropdown > button", toggleDropdown);

/**
 * Remeasure Dropdowns
 * This will remeasure the dropdown's sizes in the event
 * of an orientationChange or a reize
 */

var dropdownRemeasure;

function measureDropdowns(dropdowns) {
  loop(dropdowns, function (dropdown) {
    dropdown.classList.remove("measured");
    dropdown.style.height = "auto";
    let height = dropdown.offsetHeight;
    dropdown.style.height = height + "px";

    dropdown.classList.add("measured");
  });
}

function remeasureDropdowns() {
  let measuredDropdowns = document.querySelectorAll(".dropdown > div.measured");
  clearTimeout(dropdownRemeasure);

  dropdownRemeasure = setTimeout(function () {
    measureDropdowns(measuredDropdowns);
  }, 500);
}

addEventDelegate("resize", window, remeasureDropdowns);
