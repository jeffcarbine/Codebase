import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { showFormTemplate } from "../templates/showForm.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new c.ICON("rss"), "Shows"]),
        new c.BTNCONTAINER(
          [
            {
              "data-modal": "addShow",
              children: [new c.ICON("plus"), "Add Show"],
            },
          ],
          "centered"
        ),
        MODAL({
          modalBody: showFormTemplate(e, c, {
            action: "/periodic/admin/shows/add",
          }),
          id: "addShow",
        }),
        new e.SECTION({
          id: "showList",
          class: "loading",
        }),
      ],
    },
    [new e.MODULE("/periodic/admin/scripts/shows.js")]
  );
};
