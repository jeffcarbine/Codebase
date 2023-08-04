import { base } from "./_podsyte.view.js";
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
