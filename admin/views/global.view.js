import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { datapointFormTemplate } from "../templates/datapointForm.template.js";

export default (data) => {
  const datapoints = data.datapoints;

  return base(
    data,
    {
      children: [
        new e.H1([new c.ICON("globe"), "Global"]),
        new c.BTNCONTAINER(
          [
            {
              id: "addDatapoint",
              "data-modal": "addDatapointModal",
              children: [new c.ICON("plus"), "Create New Datapoint"],
            },
          ],
          "centered"
        ),
        {
          id: "modals",
          children: [
            MODAL({
              modalBody: {
                children: [
                  new e.H2("Add New Datapoint"),
                  datapointFormTemplate({ pageId: "global" }),
                ],
              },
              id: "addDatapointModal",
            }),
          ],
        },
        new e.SECTION({
          id: "datapoints",
          class: "card-canvas",
        }),
      ],
    },
    [
      new e.MODULE({
        textContent: `
          const pageId = "global";
        `,
      }),
      new e.MODULE("/periodic/admin/scripts/global.scripts.js"),
    ]
  );
};
