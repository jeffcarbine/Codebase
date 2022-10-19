import { addEventDelegate } from "../eventdelegate/_eventdelegate.js";
import xhr from "./_xhr.js";

const inputXhr = function (input) {
  // first, find the label for the input
  // and give it the class of "waiting"
  const label =
    input.parentNode.tagName === "LABEL"
      ? input.parentNode
      : document.querySelector("label[for=" + input.id + "]");
  console.log(label);
  label.classList.add("waiting");

  const form = input.closest("form"),
    method = form.method,
    action = form.action;

  const json = {
    hidden: {},
    data: {},
  };

  // value is different for checkboxes
  const value =
    input.type === "checkbox" || input.type === "radio"
      ? input.checked
      : input.value;
  console.log(value);

  json.data[input.name] = value;

  // get any hidden inputs, as those will
  // contain some kind of identifying data
  const hiddenInputs = form.querySelectorAll("input[type='hidden']") || [];
  hiddenInputs.forEach((hiddenInput) => {
    json.hidden[hiddenInput.name] = hiddenInput.value;
  });

  // default behaviours for success, error and failure
  const success = function () {
    label.classList.remove("waiting");
    label.classList.remove("error");
    label.classList.remove("failure");
    label.classList.remove("unsavedChanges");
  };

  const error = function (request) {
    label.classList.add("error");
    label.classList.remove("waiting");
  };

  const failure = function (request) {
    label.classList.add("failure");
    label.classList.remove("waiting");
  };

  // and now pass this all to the xhr function
  xhr(method, action, json, { success, error, failure });
};

// run xhrForm on any form with a class of xhr
addEventDelegate(
  "change",
  "form.inputXhr input, form.inputXhr textarea, form.inputXhr select",
  inputXhr,
  true
);

// make the input have unsavedChanges
const addUnsavedChanges = (input) => {
  let label = input.parentNode;

  label.classList.add("unsavedChanges");
};

addEventDelegate(
  "input",
  "form.inputXhr input, form.inputXhr textarea, form.inputXhr select",
  addUnsavedChanges,
  true
);
