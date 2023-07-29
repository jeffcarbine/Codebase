import { base } from "./_dados.view.js";
import * as e from "../../elements/elements.js";
import { cardTemplate } from "../../components/card/card.template.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { formatDate } from "../../modules/formatDate/formatDate.js";
import { toggleSingleTemplate } from "../../components/toggle/toggleSingle.template.js";

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
      toggleSingleTemplate({
        name: "soldOut",
        label: "Mark tickets as 'Sold Out'",
        checked: soldOut,
      }),
      new e.BTN({
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
                  children: [
                    new e.ICON("edit"),
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
          modalTemplate({
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
        new e.H1([new e.ICON("calendar"), "Events"]),
        new e.BTNCONTAINER(
          [
            {
              id: "addEvent",
              "data-modal": "addEventModal",
              children: [new e.ICON("plus"), "Add Event"],
            },
          ],
          "centered"
        ),
        modalTemplate({
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
