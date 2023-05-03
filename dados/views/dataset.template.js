import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { capitalize } from "../../modules/formatString/formatString.js";
import { createEditDatasetTemplate } from "../templates/createEditDataset.template.js";
import * as datapointForms from "../templates/datapointForms.template.js";

export default (data) => {
  const generateDatapointForm = () => {
    const generateForms = () => {
      const forms = [];

      for (let type in datapointForms) {
        if (!data.dataset.restricted || data.dataset.restrictedTo === type) {
          const datapointForm = [
            new e.HIDDEN({ name: "datasetId", value: data.dataset._id }),
            new e.TEXT("name"),
          ].concat(datapointForms[type]);

          forms.push(
            new e.FORM({
              method: "POST",
              action: "/admin/datapoints/add",
              id: type + "-form",
              class:
                type +
                " datapointForm" +
                (!data.dataset.restricted
                  ? type !== "text"
                    ? " hidden"
                    : ""
                  : ""),
              children: datapointForm,
            })
          );
        }
      }

      return {
        children: forms,
      };
    };

    return {
      class: "style-inputs",
      children: [
        new e.H2(
          "New " +
            (data.dataset.restricted
              ? capitalize(data.dataset.restrictedTo)
              : "Datapoint")
        ),
        new e.LABEL({
          if: !data.dataset.restricted,
          textContent: "Type",
          child: new e.SELECT({
            id: "datasetSelector",
            name: "datasetSelector",
            "data-targets": ".datapointForm",
            children: ["text", "image"],
          }),
        }),
        generateForms(),
      ],
    };
  };

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
              children: [
                new e.ICON("plus"),
                "Create New " +
                  (data.dataset.restricted
                    ? capitalize(data.dataset.restrictedTo)
                    : "Datapoint"),
              ],
            },
          ],
          "centered"
        ),
        {
          id: "modals",
          children: [
            modalTemplate(
              createEditDatasetTemplate(data.dataset),
              "editDatasetModal"
            ),
            modalTemplate(generateDatapointForm(), "addDatapointModal"),
          ],
        },
        new e.SECTION({
          id: "datapoints",
          class: "card-canvas",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
      new e.MODULE("/admin/scripts/dataset.js?" + JSON.stringify(data.dataset)),
    ]
  );
};
