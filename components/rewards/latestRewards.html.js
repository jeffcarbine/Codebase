import { H2 } from "../../elements/elements.js";
import { BTNCONTAINER } from "../components.js";

export const LATESTREWARDS = (accessKeys = []) => {
  return {
    id: "latestRewards",
    "data-component": "rewards/latestRewards",
    children: [
      {
        id: "latestRewardsList",
        "data-access-keys": JSON.stringify(accessKeys),
        class: "loading",
      },
      new BTNCONTAINER(
        {
          id: "loadMoreLatestRewards",
          textContent: "Load More",
        },
        "centered"
      ),
    ],
  };
};
