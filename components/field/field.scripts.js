import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { dataBind } from "../../modules/dataBind/dataBind.js";

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
      input.parentNode.parentNode.querySelector(".imagePreview");

    imagePreview.src = evt.target.result;
    imagePreview.style.opacity = 1;
  });

  FR.readAsDataURL(input.files[0]);
};

addEventDelegate("change", ".field input.hasPreview", renderImagePreview);

// create base64 string for file inputs
const createBase64String = (input) => {
  if (!input.files || !input.files[0]) return;

  if (input.files[0].size > 40000000) {
    const name = input.name;

    dataBind(`${name}--validation`, "Filesize is too large.");

    input.value = "";
    return;
  }

  const FR = new FileReader();

  FR.addEventListener("load", (evt) => {
    const base64file =
      input.parentNode.parentNode.querySelector("input[type=hidden]");

    base64file.value = evt.target.result;
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
