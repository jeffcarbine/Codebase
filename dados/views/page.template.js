import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { capitalize } from "../../modules/formatString/formatString.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import { datapointFormTemplate } from "../templates/datapointForm.template.js";
import { card } from "../../components/card/card.template.js";

export default (data) => {
  const datapoints = data.datapoints,
    page = data.page,
    pageId = page._id;

  const generateDatapointCards = () => {
    const datapointCards = [];

    datapoints.forEach((datapoint) => {
      const datapointCard = card({
        children: [
          new e.H2(datapoint.name),
          new e.BTN({
            children: [new e.ICON("edit"), "Edit"],
            "data-modal": "_" + datapoint._id,
          }),
          modalTemplate({
            modalBody: datapointFormTemplate(pageId, datapoint),
            id: "_" + datapoint._id,
          }),
        ],
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
          data.page.name,
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
                  (data.page.restricted
                    ? capitalize(data.page.restrictedTo)
                    : "Datapoint"),
              ],
            },
            {
              id: "viewPage",
              href: data.page.path,
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
              modalBody: datapointFormTemplate(data.page._id),
              id: "addDatapointModal",
            }),
          ],
        },
        new e.SECTION({
          id: "datapoints",
          class: "card-canvas",
          children: generateDatapointCards(),
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
