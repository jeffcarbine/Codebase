////////
// MODAL
////////

let modals = document.querySelectorAll(".modal");

if (modals.length > 0) {
  loop(modals, function(modal) {
    modal.parentNode.classList.add("modal-parent");
  });
}

function triggerModal(target) {
  let modalId = target.dataset.modal;
  showModal(modalId);
}

function showModal(modalQuery) {
  let modal = document.querySelector(modalQuery);
  let modalParent = modal.parentNode;
  modalParent.classList.add("modal-parent");
  let modalCookie = modal.dataset.cookie;

  if (modalCookie !== undefined) {
    if (getCookie(modalCookie) === null) {
      if (!modal.classList.contains("active")) {
        modal.classList.add("active");
      }

      if (!modalParent.classList.contains("modal-active")) {
        modalParent.classList.add("modal-active");
      }
    }
  } else {
    if (!modal.classList.contains("active")) {
      modal.classList.add("active");
    }

    if (!modalParent.classList.contains("modal-active")) {
      modalParent.classList.add("modal-active");
    }
  }
}

addEventDelegate("click", ".modal-trigger", triggerModal);

function hideModal(target) {
  let modal = target.parentNode;
  let modalParent = modal.parentNode;
  let cookie = modal.dataset.cookie;
  let expires = modal.dataset.expires;
  let checkbox = modal.querySelector("input[type=checkbox]");

  if (checkbox !== null) {
    if (checkbox.checked !== true) {
      checkbox.classList.add("required");
    } else {
      checkbox.classList.remove("required");
      modalParent.classList.remove("modal-active");
      modal.classList.remove("active");

      setCookie(cookie, true, expires);
    }
  } else {
    modalParent.classList.remove("modal-active");
    modal.classList.remove("active");

    setCookie(cookie, true, expires);
  }
}

addEventDelegate("click", ".modal button:not([type=submit])", hideModal);
