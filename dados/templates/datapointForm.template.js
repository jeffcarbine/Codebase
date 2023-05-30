import * as e from "../../elements/elements.js";
import { base64ImageInputComponent } from "../../elements/input/base64ImageInput.component.js";
import { datapointList } from "../models/Datapoint.js";

const datapointInputs = {
  text: (datapoint) => {
    const text = datapoint !== undefined ? datapoint.text : "";

    return [
      new e.LABEL([
        "Text Content",
        new e.TEXTAREA({
          name: "text",
          textContent: text,
        }),
      ]),
    ];
  },
  html: (datapoint) => {
    const html = datapoint !== undefined ? datapoint.html : "";

    return [
      new e.LABEL([
        "HTML Content",
        new e.TEXTAREA({
          name: "html",
          textContent: html,
        }),
      ]),
    ];
  },
  image: () => {
    return [
      base64ImageInputComponent("src"),
      new e.TEXT({ name: "alt", label: "Alt Text" }),
    ];
  },
  group: () => {
    return [];
  },
};

export const generateDatapointForms = (pageId, datapoint) => {
  let children = [];

  const generateDatapointForm = (datapointType, datapoint) => {
    const name = datapoint !== undefined ? datapoint.name : "",
      hiddenName = datapoint !== undefined ? "_id" : "pageId",
      hiddenValue = datapoint !== undefined ? datapoint._id : pageId;

    return new e.FORM({
      method: "POST",
      action: "/admin/datapoints",
      children: [
        ...[
          new e.HIDDEN({ name: hiddenName, value: hiddenValue }),
          new e.HIDDEN({ name: "type", value: datapointType }),
          new e.TEXT({
            if: pageId === undefined,
            label: "Name",
            name: "name",
            value: name,
          }),
        ],
        ...datapointInputs[datapointType](datapoint),
        ...[
          new e.BTN(
            datapoint !== undefined ? "Update Datapoint" : "Create Datapoint"
          ),
        ],
      ],
    });
  };

  // if the datapoint type is provided, we only
  // render that datapoint form
  if (datapoint !== undefined) {
    children.push(generateDatapointForm(datapoint.type, datapoint));
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

    for (let datapointType in datapointInputs) {
      const datapointForm = generateDatapointForm(datapointType);

      children.push({
        class: "hidden-input-group datapointForm " + datapointType,
        child: datapointForm,
      });
    }
  }

  return children;
};

export const datapointFormTemplate = (pageId, datapoint) => {
  return {
    class: "addEditDatapoint style-inputs",
    children: generateDatapointForms(pageId, datapoint),
  };
};
