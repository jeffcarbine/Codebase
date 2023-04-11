import { xhr } from "/periodic/scripts/xhr/_xhr.js";
import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import { createModal } from "/periodic/components/modal/modal.js";
import * as e from "/periodic/elements/elements.js";

const createAddShowModal = (button) => {
  createModal(
    new e.FORM({
      method: "POST",
      action: "/backstage/shows/add",
      class: "style-inputs xhr",
      "data-redirect": "/backstage/events",
      children: [
        new e.H2("Add Show"),
        new e.TEXT("title"),
        new e.TEXT({
          label: "RSS",
          name: "rss",
        }),
        new e.TEXT("patreon"),
        new e.TEXT("spotify"),
        new e.TEXT("youTube"),
        new e.TEXT("apple"),
        new e.BTN({
          id: "createEvent",
          textContent: "Create Show",
        }),
      ],
    }),
    button
  );
};

addEventDelegate("click", "#addShow", createAddShowModal);
