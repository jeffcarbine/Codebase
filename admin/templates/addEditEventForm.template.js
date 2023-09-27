import { FIELD, TOGGLESINGLE, BTN } from "../../components/components.js";
import * as e from "../../elements/elements.js";

export const addEditEventFormTemplate = (eventData = {}) => {
  const _id = eventData._id || null,
    venue = eventData.venue || null,
    title = eventData.title || null,
    street = eventData.street || null,
    city = eventData.city || null,
    region = eventData.region || null,
    country = eventData.country || null,
    date = eventData.date || null,
    publishDate = eventData.publishDate || null,
    tickets = eventData.tickets || null,
    soldOut = eventData.soldOut || false;

  const formChildren = [
    new FIELD({
      name: "venue",
      label: "Venue",
      value: venue,
    }),
    new FIELD({
      name: "title",
      label: "Title",
      value: title,
    }),
    new FIELD({
      name: "street",
      label: "Street",
      value: street,
    }),
    new FIELD({
      name: "city",
      label: "City",
      value: city,
    }),
    new FIELD({
      name: "region",
      label: "Region",
      value: region,
    }),
    new FIELD({
      name: "country",
      label: "Country",
      value: country,
    }),
    new FIELD({
      type: "date",
      name: "date",
      label: "Show Date",
      value: date,
    }),
    new FIELD({
      type: "date",
      label: "Publish Date",
      value: publishDate,
      name: publishDate,
    }),
    new FIELD({
      name: "tickets",
      label: "Tickets",
      value: tickets,
    }),
    TOGGLESINGLE({
      name: "soldOut",
      label: "Mark tickets as 'Sold Out'",
      checked: soldOut,
    }),
    new BTN({
      id: "createEvent",
      textContent: "Save Changes",
    }),
  ];

  if (eventData._id !== undefined) {
    formChildren.unshift(new e.HIDDEN({ name: "_id", value: _id }));
  }

  return new e.FORM({
    method: "POST",
    action: "/periodic/admin/events",
    class: "style-inputs addEditEvent",
    children: formChildren,
  });
};
