import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export default (data) => {
  return base(
    data,
    {
      id: "members",
      children: [
        new e.H1([new c.ICON("users"), "Members"]),
        new e.SECTION({
          id: "membersList",
          class: "card-canvas loading",
        }),
      ],
    },
    [new e.MODULE("/periodic/admin/scripts/members.scripts.js")]
  );
};
