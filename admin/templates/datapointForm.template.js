import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { BASE64IMAGEINPUT } from "../../elements/input/base64ImageInput.component.js";
import { datapointList, groupTypes } from "../models/datapointList.js";
import { TOGGLESINGLE } from "../../components/toggle/toggleSingle.component.js";
import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";

const datapointInputs = {
  text: (datapoint) => {
    const text = datapoint !== undefined ? datapoint.text : "";

    return [
      new c.FIELD({
        type: "textarea",
        label: "Text Content",
        textContent: text,
      }),
    ];
  },

  link: (datapoint) => {
    const href = datapoint !== undefined ? datapoint.link.href : "",
      title = datapoint !== undefined ? datapoint.link.title : "";

    return [
      new c.FIELD({
        label: "URL",
        name: "href",
        value: href,
      }),
      new c.FIELD({
        label: "Title",
        name: "title",
        value: title,
      }),
    ];
  },

  html: (datapoint) => {
    const html = datapoint !== undefined ? datapoint.html : "";

    return [
      new c.FIELD({
        type: "textarea",
        label: "HTML Content",
        textContent: html,
      }),
    ];
  },

  image: (datapoint) => {
    const alt = datapoint !== undefined ? datapoint.image.alt : "",
      src = datapoint !== undefined ? datapoint.image.src : null;

    return [
      new c.FIELD({
        type: "file",
        label: "Image",
        name: "image",
        accept: "image/*",
        preview: true,
        value: src,
      }),
      new c.FIELD({
        label: "Alt Text",
        name: "alt",
        value: alt,
      }),
    ];
  },

  person: (datapoint) => {
    const nickname = datapoint !== undefined ? datapoint.person.nickname : "",
      pronouns = datapoint !== undefined ? datapoint.person.pronouns : "",
      job = datapoint !== undefined ? datapoint.person.job : "",
      description = datapoint !== undefined ? datapoint.person.description : "",
      bio = datapoint !== undefined ? datapoint.person.bio : "",
      playedBy = datapoint !== undefined ? datapoint.person.playedBy : "";

    return [
      new c.FIELD({
        label: "Nickname",
        name: "nickname",
        value: nickname,
      }),
      new c.FIELD({
        label: "Pronouns",
        name: "pronouns",
        value: pronouns,
      }),
      new c.FIELD({
        label: "Job",
        name: "job",
        value: job,
      }),
      new c.FIELD({
        label: "Description",
        name: "description",
        value: description,
      }),
      new c.FIELD({
        label: "Bio",
        name: "bio",
        value: bio,
        type: "textarea",
      }),
      new c.FIELD({
        label: "Played By",
        name: "playedBy",
        value: playedBy,
      }),
    ];
  },

  group: (datapoint) => {
    const groupWildcard =
        datapoint !== undefined ? datapoint.groupWildcard : "",
      groupType = datapoint !== undefined ? datapoint.groupType : "";

    return [
      new c.FIELD({
        label: "Group Wildcard",
        name: "groupWildcard",
        value: groupWildcard,
      }),
      new c.FIELD({
        label: "Group Type",
        name: "groupType",
        type: "select",
        options: groupTypes,
        selected: groupType,
      }),
    ];
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
    const name = datapoint !== undefined ? datapoint.name : "",
      isActive = datapoint !== undefined ? datapoint.active : true;

    return new e.FORM({
      method: "POST",
      action: "/periodic/admin/datapoints",
      class: "datapointForm",
      children: [
        ...[
          new e.HIDDEN({ name: hiddenName, value: hiddenValue }),
          new e.HIDDEN({ name: "type", value: datapointType }),
          new c.FIELD({
            label: "Name",
            name: "name",
            value: name,
          }),
          TOGGLESINGLE({
            name: "active",
            value: "active",
            label: "Active",
            checked: isActive,
          }),
        ],
        ...datapointInputs[datapointType](datapoint),
        ...[
          new c.BTN(
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

    const uniqueId = generateUniqueId();

    children.unshift(
      new c.FIELD({
        label: "Datapoint Type",
        name: "type",
        "data-targets": `.${uniqueId}`,
        type: "select",
        options: datapointList,
      })
    );

    for (let datapointType in datapointInputs) {
      const datapointForm = generateDatapointForm(
        datapointType,
        hiddenName,
        hiddenValue
      );

      children.push({
        class: `hidden-input-group datapointForm ${datapointType} ${uniqueId}`,
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
