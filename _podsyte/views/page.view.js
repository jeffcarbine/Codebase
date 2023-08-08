import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { capitalize } from "../../modules/formatString/formatString.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import { datapointFormTemplate } from "../templates/datapointForm.template.js";
import { CARD } from "../../components/card/card.component.js";

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
          new c.BTN({
            class: "accent",
            children: [
              new c.ICON("plus"),
              new e.SPAN({ class: "text", textContent: "Add" }),
            ],
            "data-modal": `addTo${datapoint._id}`,
          }),
          MODAL({
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

      const datapointCard = CARD({
        body: {
          children: [
            {
              class: "title-edit",
              children: [
                new e.H2([new c.ICON(type), datapoint.name]),
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
          new c.ICON("page"),
          new e.A({ href: "/admin/pages", textContent: "Pages" }),
          new c.ICON("chevronRight"),
          data.pageData.name,
        ]),
        new c.BTNCONTAINER(
          [
            {
              id: "editPage",
              "data-modal": "editPageModal",
              children: [new c.ICON("edit"), "Edit Page"],
            },
            {
              id: "addDatapoint",
              "data-modal": "addDatapointModal",
              children: [
                new c.ICON("plus"),
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
              children: [new c.ICON("eye"), "View Page"],
            },
          ],
          "centered"
        ),
        {
          id: "modals",
          children: [
            MODAL({
              modalBody: createEditPageTemplate(data.page),
              id: "editPageModal",
            }),
            MODAL({
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
      new e.MODULE("/periodic/modules/xhr/_xhrForm.js"),
      new e.MODULE(
        "/admin/scripts/pageData.scripts.js?" + JSON.stringify(data.page)
      ),
    ]
  );
};
