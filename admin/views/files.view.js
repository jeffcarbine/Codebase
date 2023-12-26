import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { addEditPageTemplate } from "../templates/addEditPage.template.js";
import { CARD } from "../../components/card/card.component.js";
import { TOGGLESINGLE } from "../../components/toggle/toggleSingle.component.js";

export default (data) => {
  const settings = data.settings;

  return base(
    data,
    {
      children: [
        new e.H1([new c.ICON("file"), "Files"]),
        new c.BTNCONTAINER(
          [
            {
              id: "addFile",
              "data-modal": "addFileModal",
              children: [new c.ICON("plus"), "Add File"],
            },
          ],
          "centered sm-space"
        ),

        MODAL({
          modalBody: {
            children: [
              new e.H2("Add File"),
              new e.FORM({
                id: "addFile",
                action: "/periodic/admin/files/add",
                class: "style-inputs",
                children: [
                  new c.FIELD({
                    label: "Name",
                    type: "text",
                    name: "name",
                    id: "name",
                    required: true,
                  }),
                  new c.FIELD({
                    label: "File",
                    type: "file",
                    name: "file",
                    id: "file",
                    required: true,
                  }),
                  new c.BTN("Add File"),
                ],
              }),
            ],
          },
          id: "addFileModal",
        }),
        new e.SECTION({
          id: "fileList",
          class: "card-canvas",
        }),
      ],
    },
    [new e.MODULE("/periodic/admin/scripts/files.scripts.js")]
  );
};
