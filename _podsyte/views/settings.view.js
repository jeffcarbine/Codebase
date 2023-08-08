import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "/periodic/components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import { CARD } from "../../components/card/card.component.js";
import { TOGGLESINGLE } from "../../components/toggle/toggleSingle.component.js";

const generateSettingCard = (setting) => {
  return CARD({
    body: {
      children: [
        {
          class: "title-edit",
          children: [
            new e.H2(camelize(name)),
            {
              class: "edit",
              child: new c.BTN({
                textContent: "Edit",
                "data-modal": name,
              }),
            },
          ],
        },
        {
          class: "preview",
          child: new e.P(value),
        },
      ],
    },
    className: "edit",
  });
};

const generateSettingCards = (settings) => {
  const settingCards = [];

  settings.forEach((setting) => {
    generateSettingCard(setting);

    settingCards.push(settingCard);
  });
};

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("settings"), "Settings"]),
        // SITE VALUES
        // CARD({
        //   body: {
        //     children: [
        //       {
        //         class: "title-edit",
        //         children: [
        //           new e.H2("Site Values"),
        //           {
        //             class: "edit",
        //             child: new c.BTN({
        //               textContent: "Open",
        //               "data-modal": "siteValues",
        //             }),
        //           },
        //         ],
        //       },
        //       {
        //         class: "preview",
        //         child: new e.P("Set site values like name, title format, etc."),
        //       },
        //     ],
        //   },
        //   className: "edit",
        // }),
        // MODAL({
        //   modalBody: {
        //     children: [new e.H2("Site Values")],
        //   },
        //   id: "siteValues",
        // }),
        // // FANART
        // CARD({
        //   body: {
        //     children: [
        //       {
        //         class: "title-edit",
        //         children: [
        //           new e.H2("Use Fanart"),

        //           {
        //             class: "edit",
        //             child: TOGGLESINGLE({
        //               name: "useFanArt",
        //               id: "useFanArt",
        //               checked: false,
        //             }),
        //           },
        //         ],
        //       },
        //       {
        //         class: "preview",
        //         child: new e.P(
        //           "Enables the Fanart section so submitted Fanart can be reviewed and approved."
        //         ),
        //       },
        //     ],
        //   },
        //   className: "edit",
        // }),
        // // EVENTS
        // CARD({
        //   body: {
        //     children: [
        //       {
        //         class: "title-edit",
        //         children: [
        //           new e.H2("Use Events"),

        //           {
        //             class: "edit",
        //             child: TOGGLESINGLE({
        //               name: "useEvents",
        //               id: "useEvents",
        //               checked: false,
        //             }),
        //           },
        //         ],
        //       },
        //       {
        //         class: "preview",
        //         child: new e.P(
        //           "Enables the Events section so events can be displayed on the frontend."
        //         ),
        //       },
        //     ],
        //   },
        //   className: "edit",
        // }),
        // // MERCH CLUB
        // CARD({
        //   body: {
        //     children: [
        //       {
        //         class: "title-edit",
        //         children: [
        //           new e.H2("Use Merch Club"),

        //           {
        //             class: "edit",
        //             child: TOGGLESINGLE({
        //               name: "useMerchClub",
        //               id: "useMerchClub",
        //               checked: false,
        //             }),
        //           },
        //         ],
        //       },
        //       {
        //         class: "preview",
        //         child: new e.P(
        //           "Enables the Merch Club export in Tools and the Merch Club report on the Dashboard."
        //         ),
        //       },
        //     ],
        //   },
        //   className: "edit",
        // }),
        // // SHOPIFY API
        // CARD({
        //   body: {
        //     children: [
        //       {
        //         class: "title-edit",
        //         children: [
        //           new e.H2("Shopify API Values"),
        //           {
        //             class: "edit",
        //             child: new c.BTN({
        //               textContent: "Open",
        //               "data-modal": "shopifyApi",
        //             }),
        //           },
        //         ],
        //       },
        //       {
        //         class: "preview",
        //         child: new e.P(
        //           "Provide API keys for Shopify and generate token."
        //         ),
        //       },
        //     ],
        //   },
        //   className: "edit",
        // }),
        // MODAL({
        //   modalBody: {
        //     children: [new e.H2("Shopify API Values")],
        //   },
        //   id: "shopifyApi",
        // }),
        // // PATREON API
        // CARD({
        //   body: {
        //     children: [
        //       {
        //         class: "title-edit",
        //         children: [
        //           new e.H2("Patreon API Values"),
        //           {
        //             class: "edit",
        //             child: new c.BTN({
        //               textContent: "Open",
        //               "data-modal": "patreonApi",
        //             }),
        //           },
        //         ],
        //       },
        //       {
        //         class: "preview",
        //         child: new e.P("Provide Patreon API keys and generate token."),
        //       },
        //     ],
        //   },
        //   className: "edit",
        // }),
        // MODAL({
        //   modalBody: {
        //     children: [new e.H2("Patreon API Values")],
        //   },
        //   id: "patreonApi",
        // }),
        // // SPOTIFY API
        // CARD({
        //   body: {
        //     children: [
        //       {
        //         class: "title-edit",
        //         children: [
        //           new e.H2("Spotify API Values"),
        //           {
        //             class: "edit",
        //             child: new c.BTN({
        //               textContent: "Open",
        //               "data-modal": "spotifyApi",
        //             }),
        //           },
        //         ],
        //       },
        //       {
        //         class: "preview",
        //         child: new e.P("Provide Spotify API keys and gereate token."),
        //       },
        //     ],
        //   },
        //   className: "edit",
        // }),
        // MODAL({
        //   modalBody: {
        //     children: [new e.H2("Spotify API Values")],
        //   },
        //   id: "spotifyApi",
        // }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/components/modal/modal.js"),
      new e.MODULE("/admin/scripts/tools.scripts.js"),
    ]
  );
};
