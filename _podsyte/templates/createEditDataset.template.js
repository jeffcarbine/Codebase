import { TOGGLESINGLE } from "../../components/toggle/toggleSingle.component.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export const createEditDatasetTemplate = (dataset = {}) => {
  const datasetProvided = Object.keys(dataset).length > 0,
    action = datasetProvided
      ? "/admin/datasets/dataset/edit"
      : "/admin/datasets/add",
    title = datasetProvided ? "Create Dataset" : "Edit Dataset",
    name = datasetProvided ? dataset.name : "",
    restricted = datasetProvided ? dataset.restricted : false,
    restrictedTo =
      dataset.restrictedTo !== undefined
        ? dataset.restrictedTo.toString()
        : null;

  return new e.FORM({
    id: "addEditDataset",
    method: "POST",
    action,
    class: "style-inputs",
    children: [
      new e.H2(title),
      new e.TEXT({ name: "name", label: "Name", value: name }),
      new e.HIDDEN({
        if: datasetProvided,
        name: "_id",
        value: dataset._id,
      }),
      TOGGLESINGLE({
        name: "restricted",
        label: "Restrict to One Datapoint",
        dataTargets: "#restrictedTo",
        checked: dataset.restricted,
      }),
      new e.LABEL({
        id: "restrictedTo",
        class: "active" + (restricted ? "" : " hidden"),
        textContent: "Dataset Restricted To",
        child: new e.SELECT({
          name: "restrictedTo",
          selected: restrictedTo,
          children: ["text", "image"],
        }),
      }),
      new c.BTN({
        id: "createDataset",
        textContent: "Saves Changes",
      }),
    ],
  });
};
