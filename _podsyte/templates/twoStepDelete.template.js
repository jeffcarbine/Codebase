import * as c from "/periodic/components/components.js";
import * as e from "/periodic/elements/elements.js";
import { MODAL } from "/periodic/components/components.js";

export const twoStepDeleteTemplate = ({
  path,
  id,
  parentId = "",
  parentModel = "",
} = {}) => {
  return {
    class: "two-step-delete",
    children: [
      new c.BTNCONTAINER({
        class: "accent sm",
        "data-modal": `delete-${id}`,
        textContent: "Delete",
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
