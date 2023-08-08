import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { CARD } from "../../components/card/card.component.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { formatDate } from "../../modules/formatDate/formatDate.js";
import { TOGGLESINGLE } from "../../components/toggle/toggleSingle.component.js";

export default (data) => {
  const children = [];

  const addEditEventForm = (eventData = {}) => {
    const _id = eventData._id || null,
      venue = eventData.venue || null,
      title = eventData.title || null,
      street = eventData.street || null,
      city = eventData.city || null,
      region = eventData.region || null,
      country = eventData.country || null,
      date =
        eventData.date !== undefined
          ? eventData.date.getFullYear() +
            "-" +
            ("0" + (eventData.date.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + eventData.date.getDate()).slice(-2)
          : null,
      publishDate =
        eventData.publishDate !== undefined
          ? eventData.publishDate.getFullYear() +
            "-" +
            ("0" + (eventData.publishDate.getMonth() + 1)).slice(-2) +
            "-" +
            ("0" + eventData.publishDate.getDate()).slice(-2)
          : null,
      tickets = eventData.tickets || null,
      soldOut = eventData.soldOut || false;

    const formChildren = [
      new e.TEXT({
        name: "venue",
        label: "Venue",
        value: venue,
      }),
      new e.TEXT({
        name: "title",
        label: "Title",
        value: title,
      }),
      new e.TEXT({
        name: "street",
        label: "Street",
        value: street,
      }),
      new e.TEXT({
        name: "city",
        label: "City",
        value: city,
      }),
      new e.TEXT({
        name: "region",
        label: "Region",
        value: region,
      }),
      new e.TEXT({
        name: "country",
        label: "Country",
        value: country,
      }),
      new e.DATE({
        label: "Show Date",
        value: date,
      }),
      new e.DATE({
        label: "Publish Date",
        value: publishDate,
        name: publishDate,
      }),
      new e.TEXT({
        name: "tickets",
        label: "Tickets",
        value: tickets,
      }),
      TOGGLESINGLE({
        name: "soldOut",
        label: "Mark tickets as 'Sold Out'",
        checked: soldOut,
      }),
      new c.BTN({
        id: "createEvent",
        textContent: "Save Changes",
      }),
    ];

    if (eventData._id !== undefined) {
      formChildren.unshift(new e.HIDDEN({ name: "_id", value: _id }));
    }

    return new e.FORM({
      method: "POST",
      action: "/admin/events",
      class: "style-inputs addEditEvent",
      children: formChildren,
    });
  };

  for (let i = 0; i < data.events.length; i++) {
    const eventData = data.events[i],
      eventDate =
        eventData.date.getFullYear() +
        "-" +
        ("0" + (eventData.date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + eventData.date.getDate()).slice(-2);

    const event = CARD({
      className: "edit",
      body: {
        children: [
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
              new e.P(`${formatDate(eventData.date)}`),
            ],
          },
          MODAL({
            modalBody: {
              children: [new e.H2("Edit Event"), addEditEventForm(eventData)],
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
        new e.H1([new c.ICON("calendar"), "Events"]),
        new c.BTNCONTAINER(
          [
            {
              id: "addEvent",
              "data-modal": "addEventModal",
              children: [new c.ICON("plus"), "Add Event"],
            },
          ],
          "centered"
        ),
        MODAL({
          modalBody: {
            children: [new e.H2("Add Event"), addEditEventForm()],
          },
          id: "addEventModal",
        }),
        new e.SECTION({
          id: "events",
          children,
        }),
      ],
    },
    [new e.MODULE("/admin/scripts/events.js")]
  );
};
