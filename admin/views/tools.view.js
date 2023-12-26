import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { addEditPageTemplate } from "../templates/addEditPage.template.js";
import { CARD } from "../../components/card/card.component.js";
import { editCardTemplate } from "../templates/editCard.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new c.ICON("tools"), "Tools"]),
        {
          class: "card-canvas",
          children: [
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
                      action: "/periodic/admin/tools/merchClubCSV",
                      children: [
                        new c.FIELD({
                          label: "SKU List",
                          name: "skuList",
                          id: "skuList",
                          help: "Comma separated",
                          required: true,
                        }),
                        new c.FIELD({
                          label: "Product Names",
                          name: "productNames",
                          id: "productNames",
                          help: "Comma separated",
                          required: true,
                        }),
                        new c.FIELD({
                          label: "Year",
                          name: "year",
                          id: "year",
                          type: "select",
                          options: [2023, 2022],
                        }),
                        new c.FIELD({
                          label: "Quarter",
                          name: "quarter",
                          id: "quarter",
                          type: "select",
                          options: [1, 2, 3, 4],
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
      ],
    },
    [new e.MODULE("/periodic/admin/scripts/tools.scripts.js")]
  );
};
