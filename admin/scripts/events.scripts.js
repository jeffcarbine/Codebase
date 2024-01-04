import { addEditEventFormTemplate } from "../templates/addEditEventForm.template.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr, xhrForm } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { formatSimpleDate } from "../../modules/formatDate/formatDate.js";
import * as c from "../../components/components.js";
import * as e from "../../elements/elements.js";
import { actionCardTemplate } from "../templates/actionCard.template.js";
import { formatTimeString } from "../../modules/formatTime/formatTime.js";

const generateEventCards = (events) => {
  const eventsArea = document.querySelector("#events");

  events.forEach((eventData) => {
    const eventDate = formatSimpleDate(eventData.date),
      eventTime = formatTimeString(eventData.time);

    const event = renderTemplate(
      actionCardTemplate({
        info: [new e.H2(eventData.city)],
        actions: [
          new c.BTN({
            child: new c.ICON("edit"),
            class: "icon-only",
            "aria-label": "Edit Event",
            "data-modal": "_" + eventData._id,
          }),
        ],
        body: [
          new e.P([
            new e.STRONG(eventData.venue),
            `: ${eventData.street}, ${eventData.city} ${eventData.region}, ${eventData.country}`,
          ]),
          new e.P(`${eventDate} at ${eventTime}`),
        ],
        mainModal: {
          modalBody: {
            children: [
              new e.H2("Edit Event"),
              addEditEventFormTemplate(eventData),
            ],
          },
          id: "_" + eventData._id,
        },
      })
    );

    eventsArea.appendChild(event);
  });
};

const getEvents = () => {
  const success = (request) => {
    const events = JSON.parse(request.response);

    generateEventCards(events);
  };

  xhr({ path: "/periodic/admin/events/retrieve", success });
};

getEvents();

const addEditEvent = (form) => {
  const success = () => {
    window.location.reload();
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", ".addEditEvent", addEditEvent, true);
