import { P, H1 } from "../../elements/elements.js";
import { REWARDBOX } from "./rewardBox.html.js";
import { REWARDPREVIEW } from "./rewardPreview.html.js";

const generateGroupRewards = (rewards, displayStyle, accessKeys) => {
  const children = [];

  if (displayStyle === "list") {
    rewards.forEach((reward) => {
      children.push(REWARDPREVIEW(reward, accessKeys));
    });
  } else if (displayStyle === "grid") {
    rewards.forEach((reward) => {
      children.push(REWARDBOX(reward));
    });
  }

  return children;
};

export const REWARDGROUP = (group, accessKeys = []) => {
  return {
    children: [
      {
        id: "rewardGroupTitle",
        children: [new H1(group.title)],
      },
      {
        id: "rewardGroupDescription",
        children: [
          {
            id: "rewardGroupDescriptionText",
            textContent: group.description,
          },
        ],
      },
      {
        class: `groupRewards ${group.displayStyle}`,
        children: generateGroupRewards(
          group.rewards,
          group.displayStyle,
          accessKeys
        ),
      },
    ],
  };
};
