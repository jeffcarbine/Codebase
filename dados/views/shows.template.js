import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { cardTemplate } from "../../components/card/card.template.js";
import { modalTemplate } from "../../components/modal/modal.template.js";

export default (data) => {
  const showList = () => {
    const shows = {
      class: "cardGrid",
      children: [],
    };

    for (let i = 0; i < data.shows.length; i++) {
      const showData = data.shows[i],
        event = cardTemplate(
          new e.FORM({
            method: "POST",
            action: "/admin/shows/edit",
            class: "style-inputs xhr",
            "data-redirect": "/admin/shows",
            children: [
              new e.H2(showData.title),
              new e.TEXT({
                name: "title",
                label: "Title",
                value: showData.title,
              }),
              new e.TEXT({
                name: "rss",
                label: "RSS",
                value: showData.rss,
              }),
              new e.TEXT({
                name: "patreon",
                label: "Patreon",
                value: showData.patreon,
              }),
              new e.TEXT({
                name: "spotify",
                label: "Spotify",
                value: showData.spotify,
              }),
              new e.TEXT({
                name: "youTube",
                label: "YouTube",
                value: showData.youTube,
              }),
              new e.TEXT({
                name: "apple",
                label: "Apple",
                value: showData.apple,
              }),
              new e.BTN({
                textContent: "Update Show",
              }),
            ],
          })
        );

      shows.children.unshift(event);
    }

    return shows;
  };
  const children = [showList()];

  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("podcast"), "Shows"]),
        new e.BTNCONTAINER(
          [
            {
              "data-modal": "addShow",
              children: [new e.ICON("plus"), "Add Show"],
            },
          ],
          "centered"
        ),
        modalTemplate({
          modalBody: new e.FORM({
            method: "POST",
            action: "/admin/shows/add",
            class: "style-inputs xhr",
            "data-redirect": "/admin/events",
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
          id: "addShow",
        }),
        new e.SECTION({
          id: "events",
          children,
        }),
      ],
    },
    [
      new e.MODULE("/admin/scripts/shows.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
    ]
  );
};
