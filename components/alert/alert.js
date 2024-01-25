// TODO: there is an issue with our eventdelegate that is causing the mouseout event to fire
// when hovering over the p child of the alert (ie: we are no longer hovering over the alert
// technically speaking) - this is causing the toast to fire the events over and over and
// eventually will lead to an error in the console when it triees to remove an element
// that is no longer in the DOM
// it doesn't break anything per se, but it should be fixed eventually. so, future Jeff,
// please fix it
// thank you
// - past Jeff

import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { renderTemplate } from "../../template/renderTemplate.js";

// ALERTS

const removeToast = ({
  alert,
  parent,
  head = null,
  transition = null,
} = {}) => {
  alert.classList.remove("visible");

  if (transition !== null) {
    head.removeChild(transition);
  }

  setTimeout(() => {
    parent.removeChild(alert);
  }, 1000);
};

const dismissToast = (button) => {
  let alert = button.parentNode,
    parent = alert.parentNode;

  removeToast({ alert, parent });
};

addEventDelegate("click", ".alert button.dismiss", dismissToast);

// TOAST

export const toast = ({
  message,
  parent = document.body,
  auto = true,
  dismissable = false,
  small = false,
  status = "",
}) => {
  const toastDelay = 100,
    alertId = "alert" + Date.now();

  let alert = renderTemplate({
    class:
      "alert toast " +
      status +
      " " +
      (dismissable ? " dismissable" : "") +
      (small ? " sm" : "") +
      (auto ? " auto" : ""),
    id: alertId,
    children: [
      {
        tagName: "p",
        textContent: message,
      },
      {
        if: dismissable,
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
    // we need to determine how long the
    // toast should appear for, based on
    // how many characters are in the toast
    let content = alert.textContent.trim();
    let contentLength = content.length;

    // we give the user one second for every
    // fifteen characters
    let delay = Math.round(contentLength / 10);
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
      removeToast({ alert, parent, head, transition });
    }, delay * 1000);

    let stopTimeout = function () {
      clearTimeout(timeout);
      head.removeChild(transition);
    };

    addEventDelegate("mouseover", "#" + alertId, stopTimeout);

    let resumeTimeout = function () {
      head.appendChild(transition);
      timeout = setTimeout(function () {
        removeToast({ alert, parent, head, transition });
      }, delay * 1000);
    };

    addEventDelegate("mouseout", "#" + alertId, resumeTimeout);
  }
};
