import { base } from "./_base.template.js";
import { SECTION, H1, P } from "../../elements.js";

export const index_template = (data) => {
  return base({
    main: {
      children: [
        new SECTION({
          children: [new H1(data.heading), new P(data.paragraph)],
        }),
      ],
    },
  });
};
