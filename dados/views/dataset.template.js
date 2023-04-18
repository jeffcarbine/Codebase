import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { card } from "../../components/card/card.template.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { toggleSwitchTemplate } from "../../components/toggleswitch/toggleswitch.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([
          new e.ICON("data"),
          new e.A({ href: "/admin/datasets", textContent: "Datasets" }),
          new e.ICON("chevronRight"),
          data.dataset.name,
        ]),
        new e.BTNCONTAINER(
          [
            {
              id: "editDataset",
              "data-modal": "editDatasetModal",
              children: [new e.ICON("edit"), "Edit Dataset"],
            },
            {
              id: "addDatapoint",
              "data-modal": "addDatapointModal",
              children: [new e.ICON("plus"), "Create New Datapoint"],
            },
          ],
          "centered"
        ),
        {
          id: "modals",
          children: [
            modalTemplate(
              new e.FORM({
                method: "POST",
                action: "/admin/datasets/add",
                class: "style-inputs xhr",
                "data-redirect": "/admin/datasets",
                children: [
                  new e.H2("Edit Dataset"),
                  new e.TEXT({ name: "name", value: data.dataset.name }),
                  toggleSwitchTemplate({
                    name: "restricted",
                    label: "Restrict to One Dataset",
                    checked: data.dataset.restricted,
                  }),
                  new e.LABEL({
                    id: "restrictedTo",
                    class:
                      "active" + (data.dataset.restricted ? "" : " hidden"),
                    textContent: "Dataset Restricted To",
                    child: new e.SELECT({
                      name: "restrictedTo",
                      selected: data.dataset.restrictedTo.toString(),
                      children: ["text", "image", "event", "show"],
                    }),
                  }),
                  new e.BTN({
                    id: "createDataset",
                    textContent: "Create Dataset",
                  }),
                ],
              }),
              "editDatasetModal"
            ),
            modalTemplate(
              new e.FORM({
                method: "POST",
                action: "/admin/datasets/add",
                class: "style-inputs xhr",
                "data-redirect": "/admin/datasets",
                children: [
                  new e.H2("New Datapoint"),
                  new e.TEXT("name"),
                  new e.LABEL({
                    id: "restrictedTo",
                    class: "hidden active",
                    textContent: "Dataset Restricted To",
                    child: new e.SELECT({
                      name: "restrictedTo",
                      children: ["text", "image", "event", "show"],
                    }),
                  }),
                  new e.BTN({
                    id: "createDataset",
                    textContent: "Create Dataset",
                  }),
                ],
              }),
              "addDatapointModal"
            ),
          ],
        },
        new e.SECTION({
          id: "datapoints",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/_input.js"),
      new e.MODULE("/admin/scripts/dataset.js"),
    ]
  );
};
