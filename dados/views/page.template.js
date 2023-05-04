import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { capitalize } from "../../modules/formatString/formatString.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import * as datapointForms from "../templates/datapointForms.template.js";

export default (data) => {
  console.log(data);

  const generateDatapointForm = () => {
    const generateForms = () => {
      const forms = [];

      for (let type in datapointForms) {
        if (!data.page.restricted || data.page.restrictedTo === type) {
          const datapointForm = [
            new e.HIDDEN({ name: "pageId", value: data.page._id }),
            new e.TEXT("name"),
          ].concat(datapointForms[type]);

          forms.push(
            new e.FORM({
              method: "POST",
              action: "/admin/datapoints/add",
              id: type + "-form",
              class:
                type +
                " datapointForm" +
                (!data.page.restricted
                  ? type !== "text"
                    ? " hidden"
                    : ""
                  : ""),
              children: datapointForm,
            })
          );
        }
      }

      return {
        children: forms,
      };
    };

    return {
      class: "style-inputs",
      children: [
        new e.H2(
          "New " +
            (data.page.restricted
              ? capitalize(data.page.restrictedTo)
              : "Datapoint")
        ),
        new e.LABEL({
          if: !data.page.restricted,
          textContent: "Type",
          child: new e.SELECT({
            id: "pageSelector",
            name: "pageSelector",
            "data-targets": ".datapointForm",
            children: ["text", "image"],
          }),
        }),
        generateForms(),
      ],
    };
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
              modalBody: generateDatapointForm(),
              id: "addDatapointModal",
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
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/scripts/xhr/_xhrForm.js"),
      new e.MODULE("/admin/scripts/page.js?" + JSON.stringify(data.page)),
    ]
  );
};
