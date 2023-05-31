import { modalTemplate } from "./modal.template.js";
import { renderTemplate } from "/periodic/template/renderTemplate.js";
import { addEventDelegate } from "../../scripts/eventDelegate/eventDelegate.js";

export const createModal = ({
  modalBody,
  sibling,
  className = "",
  id = "",
} = {}) => {
  console.log(modalBody);

  const newModal = renderTemplate(modalTemplate({ modalBody, className, id }));

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

export const initModals = () => {
  addEventDelegate("click", "dialog .close", closeModal, true);
  addEventDelegate("click", "button[data-modal]", openModal, true);
};
