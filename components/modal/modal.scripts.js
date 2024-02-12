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

const closeModal = (modal) => {
  // add a class that triggers an animation
  modal.classList.add("closing");

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

  // now, check if there is a previous modal to re-open
  const prevModalId = modal.dataset.prevModal;

  // if there is a previous modal to re-open, open it
  if (prevModalId !== undefined) {
    const prevModal = document.querySelector("#" + prevModalId);

    prevModal.classList.remove("hidden");

    // remove the prevModalId from the modal
    modal.removeAttribute("data-prev-modal");
  }

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
