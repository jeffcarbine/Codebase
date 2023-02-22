﻿import { addEventDelegate } from "../../scripts/eventdelegate/_eventdelegate.js";
import { renderTemplate } from "../../template/_renderTemplate.js";

// ALERTS

function removeToast(alert, head = null) {
  alert.classList.remove("visible");

  if (head !== null) {
    head.removeChild(transition);
  }

  setTimeout(() => {
    document.body.removeChild(alert);
  }, 1000);
}

const dismissToast = (button) => {
  let alert = button.parentNode;

  removeToast(alert);
};

addEventDelegate("click", ".alert button.dismiss", dismissToast);

// TOAST

export const toast = (message, params = {}, parent = document.body) => {
  const toastDelay = 100,
    auto = params.auto !== undefined ? params.auto : true,
    status = params.status,
    alertId = "alert" + Date.now();

  let alert = renderTemplate({
    class: "alert toast dismissable",
    id: alertId,
    children: [
      {
        tagName: "p",
        textContent: message,
      },
      {
        tagName: "button",
        type: "button",
        class: "dismiss",
        "aria-label": "Dismiss",
      },
    ],
  });

  parent.classList.add("toast-parent");
  parent.appendChild(alert);

  setTimeout(function () {
    alert.classList.add("visible");
  }, toastDelay);

  if (auto === true) {
    alert.classList.add("auto");
  }

  if (status !== null) {
    alert.classList.add(status);
  }

  if (auto === true) {
    // we need to determine how long the
    // toast should appear for, based on
    // how many characters are in the toast
    let content = alert.textContent.trim();
    let contentLength = content.length;

    // we give the user one second for every
    // twenty characters plus a base time of
    // two seconds
    let delay = 2 + Math.round(contentLength / 20);
    let transition = document.createElement("style");
    let head = document.querySelector("head");

    setTimeout(function () {
      transition.innerHTML =
        "#" +
        alertId +
        "::before { width: 100%; transition: all " +
        delay +
        "s linear; }";
      head.appendChild(transition);
    }, toastDelay);

    let timeout = setTimeout(function () {
      removeToast(alert, head);
    }, delay * 1000);

    let stopTimeout = function () {
      clearTimeout(timeout);
      head.removeChild(transition);
    };

    addEventDelegate("mouseover", "#" + alertId, stopTimeout);

    let resumeTimeout = function () {
      head.appendChild(transition);
      timeout = setTimeout(function () {
        alert.classList.remove("visible");
        head.removeChild(transition);
        document.body.removeChild(alert);
      }, delay * 1000);
    };

    addEventDelegate("mouseout", "#" + alertId, resumeTimeout);
  }
};
