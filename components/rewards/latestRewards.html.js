import { H2 } from "../../elements/elements.js";

export const LATESTREWARDS = (accessKeys = []) => {
  return {
    id: "latestRewards",
    "data-component": "rewards/latestRewards",
    children: [
      new H2("Latest Rewards"),
      {
        id: "latestRewardsList",
        "data-access-keys": JSON.stringify(accessKeys),
        class: "loading",
      },
    ],
  };
};
