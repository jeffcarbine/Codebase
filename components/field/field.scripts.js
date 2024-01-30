import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { dataEmit } from "../../modules/dataEmit/dataEmit.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { FIELD__ARRAYENTRY } from "./field.html.js";

const handleFocus = (target, event) => {
  const clientX = event.clientX,
    elemX = target.getBoundingClientRect().left,
    xPos = clientX - elemX,
    focus = target.parentNode.querySelector(".focus");

  focus.style.left = xPos + "px";
};

addEventDelegate("click", ".field input, .field textarea", handleFocus);

// handle image inputs with preview
const renderImagePreview = (input) => {
  if (!input.files || !input.files[0]) return;

  const FR = new FileReader();

  FR.addEventListener("load", (evt) => {
    const imagePreview =
        input.parentNode.parentNode.querySelector(".imagePreview"),
      placeholder = input.parentNode.parentNode.querySelector(".placeholder");

    imagePreview.src = evt.target.result;
    imagePreview.style.opacity = 1;
    placeholder.style.opacity = 0;
  });

  FR.readAsDataURL(input.files[0]);
};

addEventDelegate("change", ".field input.hasPreview", renderImagePreview);

// Takes a data URI and returns the Data URI corresponding to the resized image at the wanted size.
const createResizedImage = (
  datas,
  maxWidth,
  maxHeight,
  wrapper,
  name,
  size
) => {
  // get the type/extension from the base64
  const type = datas.split(";")[0].split(":")[1];

  // We create an image to receive the Data URI
  var img = document.createElement("img");

  // When the event "onload" is triggered we can resize the image.
  img.onload = function () {
    // We create a canvas and get its context.
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    let scale = 1;

    if (img.width < maxWidth) {
      scale = maxWidth / img.width;
    } else {
      scale = maxHeight / img.height;
    }
    let newWidth = img.width * scale;
    let newHeight = img.height * scale;

    // We set the dimensions at the wanted size.
    canvas.width = newWidth;
    canvas.height = newHeight;

    // We resize the image with the canvas method drawImage();
    ctx.drawImage(this, 0, 0, img.width, img.height, 0, 0, newWidth, newHeight);

    var dataURI = canvas.toDataURL(type);

    // now create a new hidden input
    const hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = `${name}_${size}`;
    hiddenInput.value = dataURI;

    // and append it to the wrapper
    wrapper.appendChild(hiddenInput);
  };

  // We put the Data URI in the image's src attribute
  img.src = datas;
};

// create base64 string for file inputs
const createBase64String = (input) => {
  if (!input.files || !input.files[0]) return;

  if (input.files[0].size > 40000000) {
    const name = input.name;

    dataEmit(`${name}--validation`, "Filesize is too large.");

    input.value = "";
    return;
  }

  const FR = new FileReader();

  FR.addEventListener("load", (evt) => {
    const wrapper = input.parentNode,
      base64file = wrapper.querySelector("input[type=hidden]"),
      name = base64file.name;

    base64file.value = evt.target.result;

    var img = new Image();

    img.onload = function () {
      const width = img.width,
        height = img.height;

      // create large, medium, small and thumnbail images

      if (width > 1600 || height > 1600) {
        console.log("need to create lg");
        createResizedImage(evt.target.result, 1600, 1600, wrapper, name, "lg");
      }

      if (width > 1000 || height > 1000) {
        console.log("need to create md");
        createResizedImage(evt.target.result, 1000, 1000, wrapper, name, "md");
      }

      if (width > 500 || height > 500) {
        console.log("need to create sm");
        createResizedImage(evt.target.result, 500, 500, wrapper, name, "sm");
      }

      if (width > 100 || height > 100) {
        console.log("need to create xs");
        createResizedImage(evt.target.result, 100, 100, wrapper, name, "xs");
      }
    };

    img.src = FR.result; // is the data URL because called with readAsDataURL
  });

  FR.readAsDataURL(input.files[0]);
};

addEventDelegate("change", ".field input[type=file]", createBase64String);

export const validateFields = (messages) => {
  // loop through the messages, and pass the message to the appropriate field

  messages.forEach((message) => {
    const field = document.querySelector(`.field[data-name=${message.field}]]`);

    if (!field) return;

    const validation = field.querySelector(".validation");

    if (!validation) return;

    validation.innerHTML = message.message;
  });
};

const toggleVisibilityWithSelect = (selectInput) => {
  const query = selectInput.dataset.targets,
    value = selectInput.value,
    targets = document.querySelectorAll(query);

  targets.forEach((target) => {
    if (target.classList.contains(value)) {
      target.classList.add("visible");
    } else {
      target.classList.remove("visible");
    }
  });
};

// make the selected hidden input group visible
const hiddenInputGroupSelects = document.querySelectorAll(
  ".field select[data-targets]"
);

if (hiddenInputGroupSelects.length > 0) {
  hiddenInputGroupSelects.forEach((hiddenInputGroupSelect) => {
    toggleVisibilityWithSelect(hiddenInputGroupSelect);
  });
}

const handleHiddenGroupMutations = (element) => {
  toggleVisibilityWithSelect(element);
};

addEventDelegate(
  "childList",
  ".field select[data-targets]",
  handleHiddenGroupMutations
);

addEventDelegate(
  "change",
  ".field select[data-targets]",
  toggleVisibilityWithSelect
);

const toggleVisibilityWithCheckbox = (checkbox) => {
  const query = checkbox.dataset.targets,
    checked = checkbox.checked,
    targets = document.querySelectorAll(query);

  targets.forEach((target) => {
    if (checked) {
      target.classList.remove("hidden");
    } else {
      target.classList.add("hidden");
    }
  });
};

addEventDelegate(
  "change",
  ".field input[type='checkbox'][data-targets]",
  toggleVisibilityWithCheckbox
);

// reorder list scripts (new!)

let reordering = false,
  draggingItem = null;

const reorderItemStart = (button) => {
  if (!reordering) {
    const item = button.parentNode;
    item.classList.add("dragging");
    draggingItem = item;
    reordering = true;
  }
};

const reorderItemMove = (button, e) => {
  if (reordering) {
    const reorderList = draggingItem.parentNode,
      // get the clientY relative to the reorderList
      clientY = e.clientY - reorderList.getBoundingClientRect().top;

    // Getting all items except currently dragging and making array of them
    let siblings = [
      ...reorderList.querySelectorAll(".reorderItem:not(.dragging)"),
    ];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find((sibling) => {
      return clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    reorderList.insertBefore(draggingItem, nextSibling);

    // now, get all of the items in the list, pull their values, and set
    // the value of the hidden input
    const hiddenInput = reorderList.nextElementSibling;
    const value = [...reorderList.querySelectorAll(".reorderItem")].map(
      (item) => item.dataset.value
    );

    hiddenInput.value = value.join(",");
  }
};

const reorderItemEnd = () => {
  if (reordering) {
    draggingItem.classList.remove("dragging");
    draggingItem = null;
    reordering = false;
  }
};

addEventDelegate(
  "touchstart, mousedown",
  ".reorderItem .handle",
  reorderItemStart
);

addEventDelegate("touchmove, mousemove", "body", reorderItemMove);

addEventDelegate("touchend, mouseup", "body", reorderItemEnd);

// handle the faux-select
const syncSelectValue = (select) => {
  const fauxSelect = select.parentNode.querySelector(".faux-select"),
    value = select.options[select.selectedIndex].text;

  fauxSelect.innerHTML = value;
};

addEventDelegate("change", ".field select", syncSelectValue);

// and handle it on initial load
const selects = document.querySelectorAll(".field select");

if (selects.length > 0) {
  selects.forEach((select) => {
    syncSelectValue(select);
  });
}

const handleSelectOptionHelp = (select) => {
  const name = select.name,
    selectedOption = select.options[select.selectedIndex],
    help = selectedOption.dataset.help;

  dataEmit(`${name}--help`, help);
};

addEventDelegate("change", ".field select", handleSelectOptionHelp);

// // handle the data-checked value of labels that contain checkboxes/radios/toggles
// const syncCheckedValue = (input) => {
//   const wrapper = input.parentNode;

//   if (input.checked) {
//     wrapper.dataset.checked = true;
//   } else {
//     delete wrapper.dataset.checked;
//   }
// };

// addEventDelegate("change", ".field.checkbox-field input", syncCheckedValue);

// // toggle checked on wrapper click
// const toggleChecked = (wrapper) => {
//   console.log(wrapper);
//   const input = wrapper.querySelector("input");

//   input.click();
// };

// addEventDelegate("click", ".field.checkbox-field .wrapper", toggleChecked);

// handle converting a date input to the corresponding simpledate input
const convertDateToSimpleDate = (dateInput) => {
  const date = dateInput.value,
    parent = dateInput.parentNode,
    simpledateName = dateInput.dataset.simpledate,
    simpleDateInput = parent.querySelector(`input[name=${simpledateName}]`);

  console.log(simpleDateInput);

  if (!simpleDateInput) return;

  const simpleDate = date.replace(/-/g, "");

  console.log(simpleDate);

  simpleDateInput.value = simpleDate;
};

addEventDelegate(
  "change",
  ".field input[data-simpledate]",
  convertDateToSimpleDate
);

// handle converting a currency input to the corresponding simplecurrency input
const convertCurrencyToSimpleCurrency = (currencyInput) => {
  const currency = currencyInput.value,
    parent = currencyInput.parentNode,
    simplecurrencyName = currencyInput.dataset.simplecurrency,
    simpleCurrencyInput = parent.querySelector(
      `input[name=${simplecurrencyName}]`
    );

  if (!simpleCurrencyInput) return;

  const simpleCurrency = currency * 100;

  simpleCurrencyInput.value = simpleCurrency;
};

addEventDelegate(
  "change",
  ".field input[data-simplecurrency]",
  convertCurrencyToSimpleCurrency
);

// handle adding two decimal places on simplecurrency input focusout
const addTwoDecimalPlaces = (input) => {
  const value = parseFloat(input.value),
    formatted = value.toFixed(2);

  input.value = formatted;
};

addEventDelegate(
  "focusout",
  ".field input[data-simplecurrency]",
  addTwoDecimalPlaces
);

// toggle checkbox/radio checked property on pseudo element click
const toggleChecked = (pseudo) => {
  const input = pseudo.parentNode.querySelector("input");

  input.click();
};

addEventDelegate("click", ".field .pseudo", toggleChecked);

// update the hidden input that contains the values for the array field
const updateArrayInput = (input) => {
  const arrayInputName = input.dataset.input,
    arrayInput = document.querySelector(`input[name=${arrayInputName}]`),
    wrapper = arrayInput.parentNode,
    values = [...wrapper.querySelectorAll("input:checked")].map(
      (input) => input.value
    );

  console.log(arrayInputName);

  arrayInput.value = JSON.stringify(values);
};

addEventDelegate(
  "change",
  ".field.array-field input[type='checkbox']",
  updateArrayInput
);

// handle the data-checked value of the wrapper for toggledual fields
const syncCheckedValue = (input) => {
  // get the wrapper
  const wrapper = input.parentNode;

  if (input.checked) {
    wrapper.dataset.toggled = input.dataset.number;
  }
};

addEventDelegate("change", ".field.toggledual-field input", syncCheckedValue);

// add new items to the array field from a text input
const addToArray = (button) => {
  const fieldset = button.parentNode.parentNode.parentNode,
    input = button.parentNode.querySelector("input"),
    value = input.value,
    arrayInput = fieldset.querySelector(`input[type=hidden]`),
    arrayInputValue = arrayInput.value,
    arrayInputValues = JSON.parse(arrayInputValue);

  arrayInputValues.push(value);
  arrayInput.value = JSON.stringify(arrayInputValues);

  // now create a new arrayTag and push it to the arrayTags element
  const arrayEntries = fieldset.querySelector(".arrayEntries"),
    arrayTag = renderTemplate(new FIELD__ARRAYENTRY({ textContent: value }));

  arrayEntries.appendChild(arrayTag);

  input.value = "";
};

addEventDelegate("click", ".field.array-field .array__add", addToArray);

// remove items from the array field by clicking the remove button in the arrayEntry button
const removeFromArray = (button) => {
  const fieldset = button.parentNode.parentNode.parentNode,
    arrayInput = fieldset.querySelector(`input[type=hidden]`),
    arrayInputValue = arrayInput.value,
    arrayInputValues = JSON.parse(arrayInputValue),
    arrayEntry = button.parentNode,
    value = arrayEntry.textContent;

  // remove the value from the arrayInputValues
  const index = arrayInputValues.indexOf(value);
  arrayInputValues.splice(index, 1);
  arrayInput.value = JSON.stringify(arrayInputValues);

  arrayEntry.remove();
};

addEventDelegate(
  "click",
  ".field.array-field .arrayEntry__remove",
  removeFromArray
);
