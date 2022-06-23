// ALERTS

function initDismissableAlerts() {
  let dismissableAlerts = document.querySelectorAll(
    ".alert.dismissable:not(.initialized), .alert.toast:not(.initialized)"
  );

  loop(dismissableAlerts, function(alert) {
    // before we make it dismissable, check to see
    // if they should be auto-dismissed via cookie

    let cookie = alert.dataset.cookie;

    if (cookie !== undefined) {
      if (getCookie(cookie) === null) {
        initDismissableAlert(alert);
      } else {
        alert.style.display = "none";
      }
    } else {
      initDismissableAlert(alert);
    }
  });
}

function initDismissableAlert(alert) {
  let dismiss = createDynamicElement({
    tagName: "button",
    class: "dismissAlert",
    "aria-label": "Dismiss Alert"
  });

  alert.appendChild(dismiss);

  alert.classList.add("initialized");
}

addEventDelegate("load", window, initDismissableAlerts);

function dismissAlert(target) {
  let alert = target.parentNode;
  let cookie = alert.dataset.cookie;
  let expires = alert.dataset.expires;

  let height = alert.offsetHeight + "px";
  alert.style.height = height;

  if (cookie !== null) {
    setCookie(cookie, true, expires);
  }

  setTimeout(function() {
    if (alert.classList.contains("toast")) {
      alert.classList.remove("visible");
    } else {
      alert.classList.add("dismissed");
    }
  }, 250);
}

addEventDelegate("click", "button.dismissAlert", dismissAlert);

// TOAST

function toast(message, params) {
  const toastDelay = 100;

  const auto = false;
  const type = null;

  if (params !== undefined) {
    auto = params.auto;
    type = params.type || null;
  }

  const alertId = "alet" + Date.now();

  let alert = createDynamicElement({
    class: "alert toast",
    id: alertId,
    children: [
      {
        tagName: "p",
        textContent: message
      }
    ]
  });

  document.body.appendChild(alert);

  setTimeout(function() {
    alert.classList.add("visible");
  }, toastDelay);

  if (auto === true) {
    alert.classList.add("auto");
  }

  if (type !== null) {
    alert.classList.add(type);
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

    setTimeout(function() {
      transition.innerHTML =
        "#" +
        alertId +
        "::before { width: 100%; transition: all " +
        delay +
        "s linear; }";
      head.appendChild(transition);
    }, toastDelay);

    let timeout = setTimeout(function() {
      alert.classList.remove("visible");
      head.removeChild(transition);
      document.body.removeChild(alert);
    }, delay * 1000);

    let stopTimeout = function() {
      clearTimeout(timeout);
      head.removeChild(transition);
    };

    addEventDelegate("mouseover", "#" + alertId, stopTimeout);

    let resumeTimeout = function() {
      head.appendChild(transition);
      timeout = setTimeout(function() {
        alert.classList.remove("visible");
        head.removeChild(transition);
        document.body.removeChild(alert);
      }, delay * 1000);
    };

    addEventDelegate("mouseout", "#" + alertId, resumeTimeout);
  }
}
