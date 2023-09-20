import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.SECTION({
          id: "fanart",
          children: [
            new e.H1([new c.ICON("image"), "Fanart"]),
            new e.SECTION({
              id: "fanartList",
              class: "loading",
            }),
          ],
        }),
      ],
    },
    [new e.MODULE("/periodic/admin/scripts/fanart.scripts.js")]
  );
};
