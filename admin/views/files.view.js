import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { createEditPageTemplate } from "../templates/createEditPage.template.js";
import { CARD } from "../../components/card/card.component.js";
import { TOGGLESINGLE } from "../../components/toggle/toggleSingle.component.js";

export default (data) => {
  const settings = data.settings;

  return base(
    data,
    {
      children: [new e.H1([new c.ICON("file"), "Files"])],
    },
    [
      new e.MODULE("/periodic/elements/input/input.js"),
      new e.MODULE("/periodic/components/modal/modal.js"),
      new e.MODULE("/periodic/admin/scripts/tools.scripts.js"),
    ]
  );
};
