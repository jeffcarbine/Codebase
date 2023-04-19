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
        new e.H1([new e.ICON("data"), "Datasets"]),
        new e.BTNCONTAINER(
          [
            {
              "data-modal": "addDataset",
              children: [new e.ICON("plus"), "Create Dataset"],
            },
          ],
          "centered"
        ),
        modalTemplate(
          new e.FORM({
            method: "POST",
            action: "/admin/datasets/add",
            class: "style-inputs",
            children: [
              new e.H2("New Dataset"),
              new e.TEXT("name"),
              toggleSwitchTemplate({
                name: "restricted",
                label: "Restrict to One Datapoint",
              }),
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
          "addDataset"
        ),
        new e.SECTION({
          id: "datasets",
          class: "loading",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/_input.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
      new e.MODULE("/admin/scripts/datasets.js"),
    ]
  );
};
