import { base } from "./_podbak.view.js";
import * as e from "../../elements/elements.js";
import { modalTemplate } from "../../components/modal/modal.template.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("page"), "Pages"]),
        new e.BTNCONTAINER(
          [
            {
              "data-modal": "addPage",
              children: [new e.ICON("plus"), "Create Page"],
            },
          ],
          "centered"
        ),
        modalTemplate({ modalBody: createEditPageTemplate(), id: "addPage" }),
        new e.SECTION({
          id: "pages",
          class: "datasets card-canvas",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/admin/scripts/pages.scripts.js"),
    ]
  );
};
