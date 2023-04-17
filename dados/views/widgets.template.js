import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { card } from "../../components/card/card.template.js";

export default (data) => {
  const children = [];

  for (let i = 0; i < data.events.length; i++) {
    const eventData = data.events[i],
      eventDate =
        eventData.date.getFullYear() +
        "-" +
        ("0" + (eventData.date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + eventData.date.getDate()).slice(-2),
      event = card(
        new e.FORM({
          method: "POST",
          action: "/dados/events/add",
          class: "style-inputs xhr",
          "data-redirect": "/dados/events",
          children: [
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
            new e.BTN({
              id: "createEvent",
              textContent: "Create Event",
            }),
          ],
        })
      );

    children.unshift(event);
  }

  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("components"), "Widgets"]),
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
      new e.MODULE("/dados/scripts/events.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
    ]
  );
};
