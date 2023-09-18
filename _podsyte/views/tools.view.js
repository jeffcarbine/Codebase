import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import { CARD } from "../../components/card/card.component.js";
import { editCardTemplate } from "../templates/editCard.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new c.ICON("tools"), "Tools"]),
        editCardTemplate({
          cardBody: [
            {
              class: "title-edit",
              children: [
                new e.H2("Generate Merch Club CSV"),
                {
                  class: "edit",
                  child: new c.BTN({
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
          mainModal: {
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
                    new c.BTN("Generate CSV"),
                  ],
                }),
              ],
            },
            id: "merchClubCSVModal",
          },
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
