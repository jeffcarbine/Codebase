import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { CARD } from "../../components/card/card.component.js";

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
      event = CARD(
        new e.FORM({
          method: "POST",
          action: "/periodic/admin/events/add",
          class: "style-inputs xhr",
          "data-redirect": "/periodic/admin/events",
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
            new c.BTN({
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
        new e.H1([new c.ICON("components"), "Widgets"]),
        new c.BTNCONTAINER(
          [
            {
              id: "addEvent",
              children: [new c.ICON("plus"), "Add Event"],
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
    [new e.MODULE("/periodic/admin/scripts/events.js")]
  );
};
