import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { MODAL } from "../../components/modal/modal.component.js";
import { addEditEventFormTemplate } from "../templates/addEditEventForm.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new c.ICON("calendar"), "Events"]),
        new c.BTNCONTAINER(
          [
            {
              id: "addEvent",
              "data-modal": "addEventModal",
              children: [new c.ICON("plus"), "Add Event"],
            },
          ],
          "centered"
        ),
        MODAL({
          modalBody: {
            children: [new e.H2("Add Event"), addEditEventFormTemplate()],
          },
          id: "addEventModal",
        }),
        new e.SECTION({
          id: "events",
        }),
      ],
    },
    [new e.MODULE("/periodic/admin/scripts/events.scripts.js")]
  );
};
