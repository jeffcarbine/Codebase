import { H2, H3, P } from "../../elements/elements.js";
import { CARD } from "../card/card.html.js";
import { BTNCONTAINER } from "../components.js";

export const REWARDGROUP = (group) => {
  return CARD({
    body: {
      class: "group",
      children: [
        new H3(group.title),
        {
          class: "description",
          innerHTML: group.description,
        },
        new BTNCONTAINER(
          {
            href: `/rewards/group/${group._id}`,
            textContent: "View Rewards",
          },
          "centered"
        ),
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
