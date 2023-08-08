import { base } from "./_podsyte.view.js";
import * as e from "../../elements/elements.js";
import * as c from "/periodic/components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("page"), "Pages"]),
        new c.BTNCONTAINER(
          [
            {
              "data-modal": "addPage",
              children: [new e.ICON("plus"), "Create Page"],
            },
          ],
          "centered"
        ),
        MODAL({ modalBody: createEditPageTemplate(), id: "addPage" }),
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
