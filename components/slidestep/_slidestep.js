function initSlidesteps() {
  let slidesteps = document.querySelectorAll(".slidestep");

  loop(slidesteps, function(slidestep) {
    initSlidestep(slidestep);
    slidestep.classList.add("initialized");
  });
}

function initSlidestep(slidestep) {
  let stepContainer = slidestep.firstElementChild;
  let totalSteps = stepContainer.children.length;

  slidestep.dataset.step = 1;
  slidestep.dataset.totalSteps = totalSteps;
  const uniqueId = "_" + new Date().getTime();
  slidestep.id = uniqueId;

  var isForm = false;

  if (stepContainer.tagName === "FORM") {
    slidestep.dataset.type = "form";
    isForm = true;
  }

  let controls = slidestep.querySelector("button.next").parentNode;
  controls.dataset.slidestepId = uniqueId;
  let breadcrumbs = document.createElement("div");
  breadcrumbs.classList.add("breadcrumbs");
  for (var i = 0; i < totalSteps; i++) {
    let num = i + 1;

    // bind the button to the container
    var step;
    let nthValue = i + 1;

    if (isForm) {
      step = document.querySelector(
        ".slidestep#" + uniqueId + " form > div:nth-of-type(" + nthValue + ")"
      );
    } else {
      step = slidestep.querySelector(
        ".slidestep#" + uniqueId + " div:nth-of-type(" + nthValue + ")"
      );
    }

    let stepUniqueId = "step" + new Date().getTime();
    step.id = stepUniqueId;

    let breadcrumb = document.createElement("button");
    breadcrumb.classList.add("breadcrumb");
    breadcrumb.dataset.step = num;
    breadcrumb.dataset.stepId = stepUniqueId;
    if (i === 0) {
      breadcrumb.classList.add("highlight");
    }
    breadcrumbs.appendChild(breadcrumb);
  }

  controls.insertBefore(breadcrumbs, controls.firstElementChild);
}

addEventDelegate("load", window, initSlidesteps);
//addEventDelegate("childList", ".slidestep", initSlidestep);

function slideStep(button) {
  let slidestep = button.closest(".slidestep");
  let slidestepId = slidestep.id;
  let currentStep = slidestep.dataset.step;
  let totalSteps = slidestep.dataset.totalSteps;
  let isForm = slidestep.dataset.type === "form" || false;
  var currentStepContainer;

  if (isForm) {
    currentStepContainer = document.querySelector(
      ".slidestep#" +
        slidestepId +
        " form > div:nth-of-type(" +
        currentStep +
        ")"
    );
  } else {
    currentStepContainer = document.querySelector(
      ".slidestep#" + slidestepId + " div:nth-of-type(" + currentStep + ")"
    );
  }

  if (button.classList.contains("next")) {
    if (currentStep !== totalSteps) {
      // before anything else, check if we have inputs
      let inputs = currentStepContainer.querySelectorAll("input, textarea");

      // declare stepNext first
      let stepNext = function() {
        let nextStep = parseInt(currentStep) + 1;
        slidestep.dataset.step = nextStep;
        let breadcrumb = slidestep.querySelector(
          ".breadcrumb[data-step='" + nextStep + "']"
        );
        breadcrumb.classList.add("highlight");
      };

      if (inputs.length > 0) {
        // only let us advance if the inputs have
        // some value in them
        let validInputs = true;
        loop(inputs, function(input) {
          if (
            input.type !== "radio" &&
            input.type !== "checkbox" &&
            input.type !== "hidden"
          ) {
            if (input.value === "") {
              validInputs = false;
            }
          }
        });

        if (validInputs) {
          stepNext();
        }
      } else {
        stepNext();
      }
    }
  } else if (button.classList.contains("previous")) {
    if (currentStep !== "1") {
      let lastStep = parseInt(currentStep) - 1;
      slidestep.dataset.step = lastStep;
      let breadcrumb = slidestep.querySelector(
        ".breadcrumb[data-step='" + currentStep + "']"
      );
      breadcrumb.classList.remove("highlight");
    }
  }

  if (slidestep.dataset.step === totalSteps) {
    slidestep.classList.add("complete");
  } else {
    slidestep.classList.remove("complete");
  }
}

addEventDelegate(
  "click",
  ".slidestep .previous, .slidestep .next",
  slideStep,
  false
);

function submitForm(button) {
  let slidestep = button.closest(".slidestep");

  if (slidestep.dataset.type === "form") {
    let form = slidestep.querySelector("form");

    if (form.checkValidity()) {
      form.submit();
    }
  }
}

addEventDelegate("click", ".slidestep .finish", submitForm);
