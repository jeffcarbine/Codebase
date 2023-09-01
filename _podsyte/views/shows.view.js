import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { CARD } from "../../components/card/card.component.js";
import { MODAL } from "../../components/modal/modal.component.js";

const generateShowList = (shows) => {
  const showList = [];

  for (let i = 0; i < shows.length; i++) {
    const showData = shows[i],
      showCard = CARD({
        className: "edit",
        body: {
          children: [
            {
              class: "title-edit",
              children: [
                new e.H2(showData.title),
                {
                  class: "edit",
                  child: new c.BTN({
                    children: [
                      new c.ICON("edit"),
                      new e.SPAN({ class: "text", textContent: "Edit" }),
                    ],
                    "data-modal": "_" + showData._id,
                  }),
                },
              ],
            },
            {
              class: "preview",
              child: {},
            },
            MODAL({
              modalBody: new e.FORM({
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
                    name: "releaseSchedule",
                    label: "Release Schedule",
                    value: showData.releaseSchedule,
                  }),
                  new e.LABEL([
                    "Description",
                    new e.TEXTAREA({
                      name: "description",
                      label: "Description",
                      value: showData.description,
                    }),
                  ]),
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
                  new c.BTN({
                    textContent: "Update Show",
                  }),
                ],
              }),
              id: `_${showData._id}`,
            }),
          ],
        },
      });

    showList.unshift(showCard);
  }

  return showList;
};

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new c.ICON("rss"), "Shows"]),
        new c.BTNCONTAINER(
          [
            {
              "data-modal": "addShow",
              children: [new c.ICON("plus"), "Add Show"],
            },
          ],
          "centered"
        ),
        MODAL({
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
              new c.BTN({
                id: "createEvent",
                textContent: "Create Show",
              }),
            ],
          }),
          id: "addShow",
        }),
        new e.SECTION({
          id: "events",
          children: generateShowList(data.shows),
        }),
      ],
    },
    [new e.MODULE("/admin/scripts/shows.js")]
  );
};
