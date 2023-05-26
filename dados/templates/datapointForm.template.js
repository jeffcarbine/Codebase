import * as e from "../../elements/elements.js";
import { datapointList } from "../models/Datapoint.js";

const datapointForms = {
  text: [new e.LABEL(["Body", new e.TEXTAREA("body")])],
  image: [
    new e.LABEL(["File", new e.FILE("src")]),
    new e.TEXT({ name: "alt", label: "Alt Text" }),
  ],
  group: [],
};

const generateDatapointForms = (pageId, datapoint) => {
  let children = [];

  // if the datapoint type is provided, we only
  // render that datapoint form
  if (datapoint !== undefined) {
    children.push(datapointForms[datapoint]);
  } else {
    // we need to push the datapoint form selector
    // and then each individual datapoint form
    children.unshift(
      new e.LABEL([
        "Datapoint Type",
        new e.SELECTOPTION({
          name: "type",
          "data-targets": ".datapointForm",
          children: datapointList,
        }),
      ])
    );

    for (let datapointType in datapointForms) {
      const datapointForm = new e.FORM({
        method: "POST",
        action: "/admin/datapoints/add",
        children: [
          ...[
            new e.HIDDEN({ name: "pageId", value: pageId }),
            new e.TEXT("name"),
          ],
          ...datapointForms[datapointType],
          ...[new e.BTN("Create Datapoint")],
        ],
      });

      children.push({
        class: "hidden-input-group datapointForm " + datapointType,
        child: datapointForm,
      });
    }
  }

  return children;
};

export const datapointFormTemplate = (pageId) => {
  return {
    id: "addEditDatapoint",
    class: "style-inputs",
    children: [
      ...[new e.H2("New Datapoint")],
      ...generateDatapointForms(pageId),
    ],
  };
};
