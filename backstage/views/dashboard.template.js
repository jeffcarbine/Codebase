import { base } from "./_backstage.template.js";
import * as e from "../../template/elements.js";

export default (data) => {
  return base(data, {
    children: [
      new e.SECTION({
        id: "dashboard",
        children: [new e.H1("Dashboard")],
      }),
    ],
  });
};
