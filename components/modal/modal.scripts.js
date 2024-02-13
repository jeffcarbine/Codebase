import { MODAL } from "./modal.html.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

export const createModal = ({
  modalBody,
  sibling,
  className = "",
  id = "",
} = {}) => {
  const newModal = renderTemplate(MODAL({ modalBody, className, id }));

  sibling.after(newModal);

  newModal.showModal();

  addEventDelegate("click", "dialog .close", destroyModal);
};

const destroyModal = (button) => {
  const modal = button.closest("dialog");

  modal.remove();
};

export const closeModal = (modal) => {
  // add a class that triggers an animation
  modal.classList.add("closing");

  // check to see if a parent modal exists and has a class of hidden
  const parentModal = modal.closest("dialog.hidden");

  // if it does, remove the class
  if (parentModal) {
    parentModal.classList.remove("hidden");
  }

  // get the animation duration from the css
  const duration = parseFloat(
    window.getComputedStyle(modal).getPropertyValue("animation-duration")
  );

  // after the animation duration
  setTimeout(() => {
    // close the modal
    modal.close();

    // remove the class
    modal.classList.remove("closing");
  }, duration * 1000);
};

const closeModalClick = (button) => {
  const modal = button.closest("dialog");

  closeModal(modal);
};

const hideModal = (modal) => {
  modal.classList.add("hidden");
};

const openModal = (button) => {
  // first, check to see if there is another modal already open
  const prevModal = document.querySelector("dialog[open]:not(.hidden)"),
    modalId = button.dataset.modal,
    modal = document.querySelector("#" + modalId);

  // if there is, close it and add it's id to the modal we are opening
  if (prevModal) {
    modal.dataset.prevModal = prevModal.id;
    hideModal(prevModal);

    // and then open the modal
    modal.showModal();
  } else {
    modal.showModal();
  }
};

addEventDelegate(
  "click",
  "dialog .close, dialog .cancel",
  closeModalClick,
  true
);
addEventDelegate("click", "[data-modal]", openModal, true);
