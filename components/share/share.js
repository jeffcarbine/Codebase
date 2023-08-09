import { createModal } from "../modal/modal.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { H2 } from "../../elements/elements.js";
import { ICON, CLICKTOCOPY } from "../components.js";

const share = (button) => {
  const title = button.dataset.title,
    url = button.dataset.url;

  if (navigator.share) {
    navigator
      .share({
        title,
        url,
      })
      .catch(console.error);
  } else {
    createModal({
      modalBody: {
        children: [
          {
            class: "share-icon",
            child: new ICON("share"),
          },
          new H2(title),
          {
            class: "options",
            children: [],
          },
          CLICKTOCOPY(url),
        ],
      },
      sibling: button,
      className: "share-modal",
    });
  }
};

addEventDelegate("click", "button.share", share);
