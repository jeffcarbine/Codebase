import { SPAN } from "../../elements/elements.js";

export const SQUARECARDCONTAINER = {
  id: "square-card-container",
  "data-component": "user/squareCardContainer",
  children: [
    new SPAN({
      textContent: "Credit Card",
    }),
    {
      id: "card-renderer",
      class: "initializing",
    },
  ],
};
