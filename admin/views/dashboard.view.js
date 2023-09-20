import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export default (data) => {
  return base(data, {
    children: [
      new e.SECTION({
        id: "dashboard",
        children: [new e.H1([new c.ICON("dashboard"), "Dashboard"])],
      }),
    ],
  });
};
