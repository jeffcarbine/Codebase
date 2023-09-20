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
    imagePreview.style.display = "block";
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
