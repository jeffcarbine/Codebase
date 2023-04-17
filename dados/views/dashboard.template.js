import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";

export default (data) => {
  return base(data, {
    children: [
      new e.SECTION({
        id: "dashboard",
        children: [new e.H1([new e.ICON("dashboard"), "Dashboard"])],
      }),
    ],
  });
};
