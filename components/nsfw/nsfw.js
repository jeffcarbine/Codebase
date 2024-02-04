import { setCookie, getCookie } from "../../modules/cookies/cookies.js";
import { createModal } from "../modal/modal.scripts.js";
import { BTNCONTAINER } from "../components.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import * as e from "../../elements/elements.js";

const nsfwCookie = getCookie("nsfw") || false;

const checkNsfw = () => {
  if (nsfwCookie) {
    document.body.classList.add("nsfw-allowed");
  } else {
    document.body.classList.add("nsfw-disallowed");

    // check for any nsfw-event: load elements
    const nsfwElements = document.querySelectorAll("[data-nsfw-event='load']");

    if (nsfwElements.length > 0) {
      showNsfwModal(true);
    }
  }
};

const showNsfwModal = (redirect = false) => {
  // if the cookie is false, show the modal
  if (!nsfwCookie) {
    // show modal
    createModal({
      modalBody: {
        children: [
          new e.H1("NSFW Content"),
          new e.P(
            "This content is only suitable for 18+. Please confirm you are over 18 to view this content."
          ),
          new BTNCONTAINER([
            {
              class: "confirm",
              textContent: "Yes, I am over 18",
            },
            {
              class: "deny",
              "data-redirect": redirect,
              textContent: "No, I am not over 18",
            },
          ]),
        ],
      },
      sibling: document.body,
      id: "nsfwModal",
    });
  }
};

const setNsfwCookie = (button) => {
  const isOver18 = button.classList.contains("confirm");

  // set the cookie
  setCookie("nsfw", isOver18, 30);

  if (isOver18) {
    // set the nsfw-allowed class on the body
    document.body.classList.add("nsfw-allowed");
  } else {
    // if the user is not over 18, redirect to the home page
    const redirect = button.dataset.redirect;

    if (button.dataset.redirect === "true") {
      window.location.href = "/";
    }
  }

  // hide the modal
  const modal = document.querySelector("#nsfwModal");
  modal.close();
};

export const delegate = () => {
  checkNsfw();

  addEventDelegate(
    "click",
    "body.nsfw-disallowed [data-nsfw-event='click']",
    showNsfwModal,
    true
  );

  addEventDelegate("click", "#nsfwModal button", setNsfwCookie);
};
