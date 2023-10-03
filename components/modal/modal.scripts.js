import { MODAL } from "./modal.component.js";
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
  const modal = button.parentNode;

  modal.remove();
};

const closeModal = (button) => {
  const modal = button.parentNode;

  modal.close();
};

const openModal = (button) => {
  const modalId = button.dataset.modal,
    modal = document.querySelector("#" + modalId);

  modal.showModal();
};

addEventDelegate("click", "dialog .close", closeModal, true);
addEventDelegate("click", "[data-modal]", openModal, true);
