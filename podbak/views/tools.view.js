import { base } from "./_podbak.view.js";
import * as e from "../../elements/elements.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import { cardTemplate } from "../../components/card/card.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("tools"), "Tools"]),
        cardTemplate({
          body: {
            children: [
              {
                class: "title-edit",
                children: [
                  new e.H2("Generate Merch Club CSV"),
                  {
                    class: "edit",
                    child: new e.BTN({
                      textContent: "Open",
                      "data-modal": "merchClubCSVModal",
                    }),
                  },
                ],
              },
              {
                class: "preview",
                child: new e.P(
                  "Upload CSV from Patreon and generate a Shopify CSV for Merch Club orders"
                ),
              },
            ],
          },
          className: "edit",
        }),
        modalTemplate({
          modalBody: {
            children: [
              new e.H2("Generate Merch Club CSV"),
              new e.FORM({
                class: "style-inputs",
                id: "merchClubCSV",
                method: "POST",
                action: "/admin/tools/merchClubCSV",
                children: [
                  new e.TEXT({
                    label: "SKU List",
                    name: "skuList",
                    id: "skuList",
                  }),
                  new e.TEXT({
                    label: "Product Names",
                    name: "productNames",
                    id: "productNames",
                  }),
                  new e.LABEL({
                    children: [
                      "Patreon CSV",
                      new e.FILE({
                        name: "memberData",
                        id: "memberData",
                        accept: ".csv",
                      }),
                    ],
                  }),
                  new e.BTN("Generate CSV"),
                ],
              }),
            ],
          },
          id: "merchClubCSVModal",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/components/modal/modal.js"),
      new e.MODULE("/admin/scripts/tools.scripts.js"),
    ]
  );
};
