import { H2, H3, P } from "../../elements/elements.js";
import { CARD } from "../card/card.html.js";

export const REWARDGROUP = (group) => {
  return CARD({
    body: {
      children: [
        new H3(group.title),
        {
          class: "description",
          innerHTML: group.description,
        },
      ],
    },
    className: "rewardGroup",
  });
};

export const REWARDGROUPS = () => {
  return {
    id: "rewardGroups",
    "data-component": "rewards/rewardGroups",
    children: [
      new H2("Browse by group"),
      {
        id: "rewardGroupsList",
        class: "loading",
      },
    ],
  };
};
