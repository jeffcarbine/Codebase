import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { capitalize } from "../../modules/formatString/formatString.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import { datapointFormTemplate } from "../templates/datapointForm.template.js";
import { datapointListTemplate } from "../templates/datapointList.template.js";

export default (data) => {
  const pageData = data.pageData,
    pageId = pageData._id;

  return base(
    data,
    {
      children: [
        new e.H1([
          new c.ICON("page"),
          new e.A({ href: "/periodic/admin/pages", textContent: "Pages" }),
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
              "data-modal": "addNewDatapoint",
              children: [new c.ICON("plus"), "Create New Datapoint"],
            },
            {
              id: "addDatapoint",
              "data-modal": "addExistingDatapoint",
              children: [new c.ICON("plus"), "Add Existing Datapoint"],
            },
            {
              id: "viewPage",
              href: data.pageData.homepage ? "/" : data.pageData.path,
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
              id: "addNewDatapoint",
            }),
            MODAL({
              modalBody: {
                children: [
                  new e.H2("Add Existing Datapoint"),
                  datapointListTemplate({
                    id: pageId,
                    model: "page",
                  }),
                ],
              },
              id: "addExistingDatapoint",
            }),
          ],
        },
        new e.SECTION({
          id: "datapoints",
          class: "card-canvas loading",
        }),
      ],
    },
    [
      new e.SCRIPT({
        textContent: `
          const pageId = "${pageId}";
        `,
      }),
      new e.MODULE("/periodic/admin/scripts/page.scripts.js"),
    ]
  );
};
