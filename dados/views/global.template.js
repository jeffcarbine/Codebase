import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { cardTemplate } from "../../components/card/card.template.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { datapointFormTemplate } from "../templates/datapointForm.template.js";

export default (data) => {
  const datapoints = data.datapoints;

  const generateDatapointCards = (datapoints, parentId, isChild) => {
    const datapointCards = [];

    datapoints.forEach((datapoint) => {
      let preview;
      const type = datapoint.type,
        parentModel = isChild ? "datapoint" : "global";

      switch (type) {
        case "html":
          preview = new e.PRECODE(datapoint.html);
          break;
        case "text":
          preview = new e.P(datapoint.text);
          break;
        case "image":
          preview = new e.LAZYIMG({
            src: datapoint.image.src,
            alt: datapoint.image.alt,
          });
          break;
        case "group":
          preview = {
            children: [
              new e.BTNCONTAINER({
                textContent: `Add Datapoint to ${datapoint.name}`,
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

      const datapointCard = cardTemplate({
        body: {
          children: [
            {
              class: "title-edit",
              children: [
                new e.H2(datapoint.name),
                {
                  class: "edit",
                  child: new e.BTN({
                    children: [new e.ICON("edit"), "Edit"],
                    "data-modal": "_" + datapoint._id,
                  }),
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
                  datapointFormTemplate({ datapoint }),
                  new e.BTNCONTAINER(
                    {
                      class: "removeDatapoint accent sm",
                      "data-id": datapoint._id,
                      "data-parentid": parentId,
                      "data-parentmodel": parentModel,
                      textContent: "Remove Datapoint",
                    },
                    "centered"
                  ),
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
        new e.H1([new e.ICON("globe"), "Global"]),
        new e.BTNCONTAINER(
          [
            {
              id: "addDatapoint",
              "data-modal": "addDatapointModal",
              children: [new e.ICON("plus"), "Create New Datapoint"],
            },
          ],
          "centered"
        ),
        {
          id: "modals",
          children: [
            modalTemplate({
              modalBody: {
                children: [
                  new e.H2("Add New Datapoint"),
                  datapointFormTemplate({ global: true }),
                ],
              },
              id: "addDatapointModal",
            }),
          ],
        },
        new e.SECTION({
          id: "datapoints",
          class: "card-canvas",
          children: generateDatapointCards(datapoints, true),
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
      new e.MODULE(
        "/admin/scripts/page.scripts.js?" + JSON.stringify(data.page)
      ),
    ]
  );
};
