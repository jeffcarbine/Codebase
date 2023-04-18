import { modalTemplate } from "./modal.template.js";
import { renderTemplate } from "/periodic/template/_renderTemplate.js";
import { addEventDelegate } from "../../scripts/eventDelegate/eventDelegate.js";

export const createModal = (modalBody, sibling) => {
  console.log(modalBody);

  const newModal = renderTemplate(modalTemplate(modalBody));

  sibling.after(newModal);

  newModal.showModal();

  addEventDelegate("click", "dialog .close", closeModal);
};

const closeModal = (button) => {
  const modal = button.parentNode;

  modal.remove();
};

const openModal = (button) => {
  const modalId = button.dataset.modal,
    modal = document.querySelector("#" + modalId);

  modal.showModal();
};

export const initModals = () => {
  addEventDelegate("click", "dialog .close", closeModal);
  addEventDelegate("click", "button[data-modal]", openModal);
};

// let modals = document.querySelectorAll(".modal");

// if (modals.length > 0) {
//   loop(modals, function(modal) {
//     modal.parentNode.classList.add("modal-parent");
//   });
// }

// function triggerModal(target) {
//   let modalId = target.dataset.modal;
//   showModal(modalId);
// }

// function showModal(modalQuery) {
//   let modal = document.querySelector(modalQuery);
//   let modalParent = modal.parentNode;
//   modalParent.classList.add("modal-parent");
//   let modalCookie = modal.dataset.cookie;

//   if (modalCookie !== undefined) {
//     if (getCookie(modalCookie) === null) {
//       if (!modal.classList.contains("active")) {
//         modal.classList.add("active");
//       }

//       if (!modalParent.classList.contains("modal-active")) {
//         modalParent.classList.add("modal-active");
//       }
//     }
//   } else {
//     if (!modal.classList.contains("active")) {
//       modal.classList.add("active");
//     }

//     if (!modalParent.classList.contains("modal-active")) {
//       modalParent.classList.add("modal-active");
//     }
//   }
// }

// addEventDelegate("click", ".modal-trigger", triggerModal);

// function hideModal(target) {
//   let modal = target.parentNode;
//   let modalParent = modal.parentNode;
//   let cookie = modal.dataset.cookie;
//   let expires = modal.dataset.expires;
//   let checkbox = modal.querySelector("input[type=checkbox]");

//   if (checkbox !== null) {
//     if (checkbox.checked !== true) {
//       checkbox.classList.add("required");
//     } else {
//       checkbox.classList.remove("required");
//       modalParent.classList.remove("modal-active");
//       modal.classList.remove("active");

//       setCookie(cookie, true, expires);
//     }
//   } else {
//     modalParent.classList.remove("modal-active");
//     modal.classList.remove("active");

//     setCookie(cookie, true, expires);
//   }
// }

// addEventDelegate("click", ".modal button:not([type=submit])", hideModal);
