import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { cardTemplate } from "../../components/card/card.template.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { formatDate } from "../../modules/formatDate/formatDate.js";
import { toggleSwitchTemplate } from "../../components/toggleswitch/toggleswitch.template.js";

export default (data) => {
  const children = [];

  for (let i = 0; i < data.events.length; i++) {
    const eventData = data.events[i],
      eventDate =
        eventData.date.getFullYear() +
        "-" +
        ("0" + (eventData.date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + eventData.date.getDate()).slice(-2);

    const event = cardTemplate({
      className: "edit",
      body: {
        children: [
          {
            class: "title-edit",
            children: [
              new e.H2(eventData.city),
              {
                class: "edit",
                child: new e.BTN({
                  children: [new e.ICON("edit"), "Edit"],
                  "data-modal": "_" + eventData._id,
                }),
              },
            ],
          },
          {
            class: "preview",
            children: [
              new e.H3(eventData.venue),
              new e.P(
                `${eventData.street}, ${eventData.city} ${eventData.region}, ${eventData.country}`
              ),
              new e.P(`${formatDate(eventData.date)}`),
            ],
          },
          modalTemplate({
            modalBody: {
              children: [
                new e.H2("Edit Event"),
                new e.FORM({
                  method: "POST",
                  action: "/admin/events",
                  class: "style-inputs xhr",
                  "data-redirect": "/admin/events",
                  children: [
                    new e.HIDDEN({ name: "id", value: eventData._id }),
                    new e.TEXT({
                      name: "venue",
                      label: "Venue",
                      value: eventData.venue,
                    }),
                    new e.TEXT({
                      name: "street",
                      label: "Street",
                      value: eventData.street,
                    }),
                    new e.TEXT({
                      name: "city",
                      label: "City",
                      value: eventData.city,
                    }),
                    new e.TEXT({
                      name: "region",
                      label: "Region",
                      value: eventData.region,
                    }),
                    new e.TEXT({
                      name: "country",
                      label: "Country",
                      value: eventData.country,
                    }),
                    new e.DATE({
                      label: "Show Date",
                      value: eventDate,
                    }),
                    new e.TEXT({
                      name: "tickets",
                      label: "Tickets",
                      value: eventData.tickets,
                    }),
                    toggleSwitchTemplate({
                      name: "soldOut",
                      label: "Mark tickets as 'Sold Out'",
                      checked: eventData.soldOut,
                    }),
                    new e.BTN({
                      id: "createEvent",
                      textContent: "Save Changes",
                    }),
                  ],
                }),
              ],
            },
            id: "_" + eventData._id,
          }),
        ],
      },
    });

    children.unshift(event);
  }

  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("calendar"), "Events"]),
        new e.BTNCONTAINER(
          [
            {
              id: "addEvent",
              children: [new e.ICON("plus"), "Add Event"],
            },
          ],
          "centered"
        ),
        new e.SECTION({
          id: "events",
          children,
        }),
      ],
    },
    [
      new e.MODULE("/admin/scripts/events.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
    ]
  );
};
