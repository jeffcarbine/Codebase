import { xhr } from "/periodic/scripts/xhr/_xhr.js";
import { addEventDelegate } from "/periodic/scripts/eventDelegate/eventDelegate.js";
import { createModal } from "/periodic/components/modal/modal.js";
import * as e from "/periodic/elements/elements.js";

const createAddEventModal = (button) => {
  createModal(
    new e.FORM({
      method: "POST",
      action: "/dados/events/add",
      class: "style-inputs xhr",
      "data-redirect": "/dados/events",
      children: [
        new e.H2("Add Event"),
        new e.TEXT("venue"),
        new e.TEXT("street"),
        new e.TEXT("city"),
        new e.TEXT("region"),
        new e.TEXT("country"),
        new e.TEXT("festival"),
        new e.DATE(),
        new e.TEXT("tickets"),
        new e.BTN({
          id: "createEvent",
          textContent: "Create Event",
        }),
      ],
    }),
    button
  );
};

addEventDelegate("click", "#addEvent", createAddEventModal);
