import * as e from "../../elements/elements.js";

export const text = (datasetId, datapoint = {}) => {
  const datapointAvailable = Object.keys(datapoint).length > 0;

  return [
    new e.HIDDEN({ name: "type", value: "text" }),
    new e.HIDDEN({ name: "_id", value: datapoint._id, if: datapointAvailable }),
    new e.HIDDEN({
      name: "datasetId",
      value: datasetId,
      if: datasetId !== undefined,
    }),
    new e.TEXT({
      label: "Name",
      name: "name",
      value: datapointAvailable ? datapoint.name : "",
    }),
    new e.LABEL({
      textContent: "Content",
      class: datapointAvailable ? "active" : "",
      child: new e.TEXTAREA({
        name: "value",
        textContent: datapointAvailable ? datapoint.text.value : "",
      }),
    }),
    new e.BTNCONTAINER(
      [datapointAvailable ? "Save " + datapoint.name : "Create Text"],
      "centered"
    ),
  ];
};
