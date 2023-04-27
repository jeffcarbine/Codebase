import { createModal } from "../modal/modal.js";
import * as e from "../../elements/elements.js";
import { addEventDelegate } from "../../scripts/eventDelegate/eventDelegate.js";
import { clickToCopyTemplate } from "../../components/clickToCopy/clickToCopy.template.js";
import { H2, ICON } from "../../elements/elements.js";

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
          clickToCopyTemplate(url),
        ],
      },
      sibling: button,
      className: "share-modal",
    });
  }
};

addEventDelegate("click", "button.share", share);
