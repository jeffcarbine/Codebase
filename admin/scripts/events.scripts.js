import { addEditEventFormTemplate } from "../templates/addEditEventForm.template.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhr, xhrForm } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { formatDate } from "../../modules/formatDate/formatDate.js";
import * as c from "../../components/components.js";
import * as e from "../../elements/elements.js";
import { editCardTemplate } from "../templates/editCard.template.js";

const generateEventCards = (events) => {
  const eventsArea = document.querySelector("#events");

  events.forEach((eventData) => {
    const eventDate = formatDate(new Date(eventData.date));

    const event = renderTemplate(
      editCardTemplate({
        cardBody: [
          {
            class: "title-edit",
            children: [
              new e.H2(eventData.city),
              {
                class: "edit",
                child: new c.BTN({
                  children: [
                    new c.ICON("edit"),
                    new e.SPAN({ class: "text", textContent: "Edit" }),
                  ],
                  "data-modal": "_" + eventData._id,
                }),
              },
            ],
          },
          {
            class: "preview",
            children: [
              new e.P([
                new e.STRONG(eventData.venue),
                `: ${eventData.street}, ${eventData.city} ${eventData.region}, ${eventData.country}`,
              ]),
              new e.P(`${eventDate}`),
            ],
          },
          c.MODAL({
            modalBody: {
              children: [
                new e.H2("Edit Event"),
                addEditEventFormTemplate(eventData),
              ],
            },
            id: "_" + eventData._id,
          }),
        ],
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
