import { CARD } from "../../components/card/card.component.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { datapointFormTemplate } from "./datapointForm.template.js";
import { datapointListTemplate } from "./datapointList.template.js";

export const datapointCardTemplate = ({
  datapoint,
  parentId,
  isChild,
  exclude,
}) => {
  let preview;
  const type = datapoint.type,
    parentModel = isChild ? "datapoint" : "page";

  switch (type) {
    case "html":
      preview = new c.CODEBLOCK(datapoint.html);
      break;

    case "text":
      preview = new e.P(datapoint.text);
      break;

    case "link":
      preview = {
        children: [new e.P(datapoint.link.href), new e.P(datapoint.link.title)],
      };
      break;

    case "image":
      preview = {
        children: [
          new e.LAZYIMG({
            src: datapoint.image.src,
            alt: datapoint.image.alt,
          }),
          new e.P(datapoint.image.alt),
        ],
      };
      break;

    case "person":
      preview = {
        children: [
          new e.P(datapoint.person.nickname),
          new e.P(datapoint.person.pronouns),
          new e.P(datapoint.person.job),
          new e.P(datapoint.person.description),
          new e.P(datapoint.person.bio),
          new e.P(datapoint.person.playedBy),
        ],
      };
      break;

    case "group":
      preview = {
        child: generateDatapointCards({
          datapoints: datapoint.datapoints,
          parentId: datapoint._id,
          isChild: true,
          exclude,
        }),
      };
      break;
    default:
      preview = new e.P(
        "Something went wrong and the preview cannot be rendered."
      );
  }

  let editChildren = [
    new c.BTN({
      children: [
        new c.ICON("edit"),
        new e.SPAN({ class: "text", textContent: "Edit" }),
      ],
      "data-modal": "_" + datapoint._id,
    }),
  ];

  if (datapoint.type === "group") {
    const addChildren = [
      c.DROPDOWN({
        className: "addDatapoint",
        title: [new c.ICON("plus"), "Add"],
        body: {
          children: [
            new c.BTN({
              class: "sm",
              children: [new e.SPAN({ class: "text", textContent: "New" })],
              "data-modal": `addNewTo${datapoint._id}`,
            }),
            new c.BTN({
              class: "sm",
              children: [
                new e.SPAN({ class: "text", textContent: "Existing" }),
              ],
              "data-modal": `addExistingTo${datapoint._id}`,
            }),
          ],
        },
      }),
      MODAL({
        modalBody: {
          children: [
            new e.H2(`Add New Datapoint to ${datapoint.name}`),
            datapointFormTemplate({ datapointId: datapoint._id }),
          ],
        },
        id: `addNewTo${datapoint._id}`,
      }),
      MODAL({
        modalBody: {
          children: [
            new e.H2(`Add Existing Datapoint to ${datapoint.name}`),
            datapointListTemplate({ id: datapoint._id, exclude }),
          ],
        },
        id: `addExistingTo${datapoint._id}`,
      }),
    ];

    editChildren = addChildren.concat(editChildren);
  }

  const generateDatapointIcon = () => {
    if (type !== "group") {
      return new c.ICON(type);
    } else {
      return new c.ICON(datapoint.groupType);
    }
  };

  const generateDatapointWildcard = () => {
    if (
      datapoint.groupWildcard !== undefined &&
      datapoint.groupWildcard !== ""
    ) {
      return new e.SPAN({
        class: "wildcard",
        textContent: `Wildcard: ${datapoint.groupWildcard}`,
      });
    } else {
      return "";
    }
  };

  return CARD({
    body: {
      child: c.ACCORDION({
        title: {
          class: "title-edit",
          children: [
            new e.H2([
              generateDatapointIcon(),
              datapoint.name,
              generateDatapointWildcard(),
            ]),
            {
              class: "edit",
              children: editChildren,
            },
          ],
        },
        action: "Toggle Datapoint",
        button: {
          "data-id": datapoint._id,
        },
        body: {
          children: [
            {
              class: "preview",
              child: preview,
            },
            MODAL({
              modalBody: {
                children: [
                  new e.H2(`Edit ${datapoint.name}`),
                  datapointFormTemplate({
                    datapointId: datapoint._id,
                    datapoint,
                    editing: true,
                  }),
                  new c.BTNCONTAINER(
                    {
                      class: "accent sm",
                      "data-modal": `remove-${datapoint._id}`,
                      textContent: "Remove Datapoint",
                    },
                    "centered"
                  ),
                  MODAL({
                    modalBody: {
                      children: [
                        new e.H2("Are you sure?"),
                        new e.P(
                          `This will permanently remove ${datapoint.name}.`
                        ),
                        new c.BTNCONTAINER(
                          {
                            class: "removeDatapoint",
                            "data-id": datapoint._id,
                            "data-parentid": parentId,
                            "data-parentmodel": parentModel,
                            textContent: "Yes, remove datapoint",
                          },
                          "centered"
                        ),
                      ],
                    },
                    id: `remove-${datapoint._id}`,
                  }),
                ],
              },
              id: "_" + datapoint._id,
            }),
          ],
        },
        open: datapoint.accordionOpen,
      }),
    },
    className: `edit ${datapoint._id}`,
  });
};

export const generateDatapointCards = ({
  datapoints,
  parentId,
  isChild = false,
  exclude = [],
}) => {
  const children = [];

  datapoints.forEach((datapoint) => {
    const datapointExclude = [...exclude, datapoint._id];

    const datapointCard = datapointCardTemplate({
      datapoint,
      parentId,
      isChild,
      exclude: datapointExclude,
    });

    children.push(datapointCard);
  });

  return {
    class: "datapointCards",
    children,
  };
};
