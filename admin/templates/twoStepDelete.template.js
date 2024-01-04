import * as c from "/periodic/components/components.js";
import * as e from "/periodic/elements/elements.js";
import { MODAL } from "/periodic/components/components.js";

export const twoStepDeleteTemplate = ({
  path,
  id,
  parentId = "",
  parentModel = "",
  iconOnly = false,
} = {}) => {
  const buttonContent = [new c.ICON("trash")];

  if (!iconOnly) {
    buttonContent.push("Delete");
  }

  return {
    class: "two-step-delete",
    children: [
      new c.BTN({
        class: "subtle" + (iconOnly ? " icon-only" : ""),
        "data-modal": `delete-${id}`,
        children: buttonContent,
      }),
      MODAL({
        modalBody: {
          children: [
            new e.H2("Are you sure?"),
            new e.P("This action cannot be undone."),
            new c.BTNCONTAINER([
              {
                class: "delete",
                "data-id": id,
                "data-path": path,
                "data-parentid": parentId,
                "data-parentmodel": parentModel,
                textContent: "Yes, delete",
              },
              {
                class: "cancel",
                textContent: "No, cancel",
              },
            ]),
          ],
        },
        id: `delete-${id}`,
      }),
    ],
  };
};
