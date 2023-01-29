import { base } from "./views/_base.template.js";
import { SECTION, H1, P } from "../elements.js";

base({
  main: {
    children: [
      new SECTION({
        children: [
          H1("The Inevitable Robot Apocalypse"),
          P("Barracade your doors and lock up your Pennzoil"),
        ],
      }),
    ],
  },
});
