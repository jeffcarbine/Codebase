import { base } from "./_dados.view.js";
import * as e from "../../elements/elements.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { capitalize } from "../../modules/formatString/formatString.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import { datapointFormTemplate } from "../templates/datapointForm.template.js";
import { cardTemplate } from "../../components/card/card.template.js";

export default (data) => {
  const datapoints = data.datapoints,
    pageData = data.pageData,
    pageId = pageData._id;

  const generateDatapointCards = (datapoints, parentId, isChild) => {
    const datapointCards = [];

    datapoints.forEach((datapoint) => {
      let preview;
      const type = datapoint.type,
        parentModel = isChild ? "datapoint" : "page";

      switch (type) {
        case "html":
          preview = new e.PRECODE(datapoint.html);
          break;
        case "text":
          preview = new e.P(datapoint.text);
          break;
        case "link":
          preview = {
            children: [
              new e.P(datapoint.link.href),
              new e.P(datapoint.link.title),
            ],
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
        case "group":
          preview = {
            children: [
              {
                class: "children-datapoints",
                children: generateDatapointCards(
                  datapoint.datapoints,
                  datapoint._id,
                  true
                ),
              },
            ],
          };
          break;
        default:
          preview = new e.P(
            "Something went wrong and the preview cannot be rendered."
          );
      }

      let editChildren = [
        new e.BTN({
          children: [new e.ICON("edit"), "Edit"],
          "data-modal": "_" + datapoint._id,
        }),
      ];

      if (datapoint.type === "group") {
        const addChildren = [
          new e.BTN({
            class: "accent",
            children: [new e.ICON("plus"), "Add"],
            "data-modal": `addTo${datapoint._id}`,
          }),
          modalTemplate({
            modalBody: {
              children: [
                new e.H2(`Add Datapoint to ${datapoint.name}`),
                datapointFormTemplate({ datapointId: datapoint._id }),
              ],
            },
            id: `addTo${datapoint._id}`,
          }),
        ];

        editChildren = addChildren.concat(editChildren);
      }

      const datapointCard = cardTemplate({
        body: {
          children: [
            {
              class: "title-edit",
              children: [
                new e.H2([new e.ICON(type), datapoint.name]),
                {
                  class: "edit",
                  children: editChildren,
                },
              ],
            },
            {
              class: "preview",
              child: preview,
            },
            modalTemplate({
              modalBody: {
                children: [
                  new e.H2(`Edit ${datapoint.name}`),
                  datapointFormTemplate({
                    datapointId: datapoint._id,
                    datapoint,
                    editing: true,
                  }),
                  new e.BTNCONTAINER(
                    {
                      class: "accent sm",
                      "data-modal": `remove-${datapoint._id}`,
                      textContent: "Remove Datapoint",
                    },
                    "centered"
                  ),
                  modalTemplate({
                    modalBody: {
                      children: [
                        new e.H2("Are you sure?"),
                        new e.P(
                          `This will permanently remove ${datapoint.name}.`
                        ),
                        new e.BTNCONTAINER(
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
        className: "edit",
      });

      datapointCards.push(datapointCard);
    });

    return datapointCards;
  };

  return base(
    data,
    {
      children: [
        new e.H1([
          new e.ICON("webpage"),
          new e.A({ href: "/admin/pages", textContent: "Pages" }),
          new e.ICON("chevronRight"),
          data.pageData.name,
        ]),
        new e.BTNCONTAINER(
          [
            {
              id: "editPage",
              "data-modal": "editPageModal",
              children: [new e.ICON("edit"), "Edit Page"],
            },
            {
              id: "addDatapoint",
              "data-modal": "addDatapointModal",
              children: [
                new e.ICON("plus"),
                "Create New " +
                  (data.pageData.restricted
                    ? capitalize(data.pageData.restrictedTo)
                    : "Datapoint"),
              ],
            },
            {
              id: "viewPage",
              href: data.pageData.path,
              target: "blank",
              children: [new e.ICON("peek"), "View Page"],
            },
          ],
          "centered"
        ),
        {
          id: "modals",
          children: [
            modalTemplate({
              modalBody: createEditPageTemplate(data.page),
              id: "editPageModal",
            }),
            modalTemplate({
              modalBody: {
                children: [
                  new e.H2("Add New Datapoint"),
                  datapointFormTemplate({ pageId }),
                ],
              },
              id: "addDatapointModal",
            }),
          ],
        },
        new e.SECTION({
          id: "datapoints",
          class: "card-canvas",
          children: generateDatapointCards(datapoints, pageId),
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
      new e.MODULE(
        "/admin/scripts/pageData.scripts.js?" + JSON.stringify(data.page)
      ),
    ]
  );
};
