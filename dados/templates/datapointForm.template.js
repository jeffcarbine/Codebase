import { modalTemplate } from "../../components/modal/modal.template.js";
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
  image: (datapoint) => {
    const alt = datapoint !== undefined ? datapoint.image.alt : "",
      src = datapoint !== undefined ? datapoint.image.src : "";

    return [
      base64ImageInputComponent("base64Image"),
      new e.TEXT({ name: "alt", label: "Alt Text", value: alt }),
    ];
  },
  group: () => {
    return [];
  },
};

export const generateDatapointForms = ({
  pageId = null,
  datapointId = null,
  global = false,
  editing = false,
  datapoint,
} = {}) => {
  let children = [];

  let hiddenName, hiddenValue;

  if (pageId !== null && !editing) {
    hiddenName = "pageId";
    hiddenValue = pageId;
  } else if (datapointId !== null && !editing) {
    hiddenName = "datapointId";
    hiddenValue = datapointId;
  } else if (global && !editing) {
    hiddenName = "global";
    hiddenValue = true;
  } else {
    hiddenName = "id";
    hiddenValue = datapoint._id;
  }

  const generateDatapointForm = (
    datapointType,
    hiddenName,
    hiddenValue,
    datapoint
  ) => {
    const name = datapoint !== undefined ? datapoint.name : "";

    return new e.FORM({
      method: "POST",
      action: "/admin/datapoints",
      children: [
        ...[
          new e.HIDDEN({ name: hiddenName, value: hiddenValue }),
          new e.HIDDEN({ name: "type", value: datapointType }),
          new e.TEXT({
            if: datapoint === undefined,
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
    children.push(
      generateDatapointForm(datapoint.type, hiddenName, hiddenValue, datapoint)
    );
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
      const datapointForm = generateDatapointForm(
        datapointType,
        hiddenName,
        hiddenValue
      );

      children.push({
        class: "hidden-input-group datapointForm " + datapointType,
        child: datapointForm,
      });
    }
  }

  return children;
};

export const datapointFormTemplate = ({
  pageId = null,
  datapointId = null,
  global = false,
  editing = false,
  datapoint,
}) => {
  return {
    class: "addEditDatapoint style-inputs",
    children: generateDatapointForms({
      pageId,
      datapointId,
      global,
      datapoint,
      editing,
    }),
  };
};
