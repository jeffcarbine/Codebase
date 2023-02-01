import { addEventDelegate } from "../eventdelegate/_eventdelegate.js";
import { xhr } from "./_xhr.js";

const xhrInput = function (input) {
  // first, find the label for the input
  // and give it the class of "waiting"
  const label =
    input.parentNode.tagName === "LABEL"
      ? input.parentNode
      : document.querySelector("label[for='" + (input.id || input.name) + "']");

  if (label !== null) {
    label.classList.add("waiting");
  }

  const method = input.getAttribute("method"),
    action = input.getAttribute("action"),
    data = JSON.parse(input.dataset.xhrStaticValues),
    name = input.name;

  let value = // different for checkboxes
    input.type === "checkbox" || input.type === "radio"
      ? input.checked
      : input.value;

  // if this is a number input, parseInt if no period, parseFloat if period
  if (input.type === "number") {
    if (value.includes(".")) {
      value = parseFloat(value);
    } else {
      value = parseInt(value);
    }
  }

  data[name] = value;

  console.log(data);

  // default behaviours for success, error and failure
  const success = function () {
    if (label !== null) {
      label.classList.remove("waiting");
      label.classList.remove("error");
      label.classList.remove("failure");
      label.classList.remove("unsavedChanges");
    }
  };

  const error = function (request) {
    if (label !== null) {
      label.classList.add("error");
      label.classList.remove("waiting");
    }
  };

  const failure = function (request) {
    if (label !== null) {
      label.classList.add("failure");
      label.classList.remove("waiting");
    }
  };

  // and now pass this all to the xhr function
  xhr(method, action, data, { success, error, failure });
};

// run xhrForm on any form with a class of xhr
addEventDelegate(
  "change",
  "input.xhrInput, textarea.xhrInput, select.xhrInput",
  xhrInput,
  true
);

// make the input have unsavedChanges
const addUnsavedChanges = (input) => {
  let label = input.parentNode;

  label.classList.add("unsavedChanges");
};

addEventDelegate(
  "input",
  "input.xhrInput, textarea.xhrInput, select.xhrInput",
  addUnsavedChanges,
  true
);
