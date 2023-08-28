import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { datapointFormTemplate } from "../templates/datapointForm.template.js";
import { generateDatapointCards } from "../templates/datapointCard.template.js";

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
          children: generateDatapointCards(datapoints, "global"),
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/components/accordion/accordion.js"),
      new e.MODULE("/admin/scripts/global.scripts.js"),
    ]
  );
};
