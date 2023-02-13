import { base } from "./_backstage.template.js";
import { SECTION, H1, P, IMG } from "../../template/elements.js";

export default (data) => {
  return base(data, {
    children: [
      new SECTION({
        id: "dashboard",
      }),
    ],
  });
};
