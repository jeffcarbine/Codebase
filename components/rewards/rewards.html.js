import { AUTHORIZINGPATREON, PATREONAUTH } from "../user/patreonAuth.html.js";
import { SELECTTIER } from "../user/selectTier.html.js";
import { SIGNUP } from "../user/signUp.html.js";
import { LATESTREWARDS } from "./latestRewards.html.js";
import { REWARDGROUPS } from "./rewardGroups.html.js";

export const REWARDS = (data, patreon = false, accessKeys = []) => {
  const user = data.user,
    query = data.query;

  // render different things depending on the user's info
  if (user && user.username !== undefined) {
    return {
      id: "rewards",
      children: [LATESTREWARDS(accessKeys), REWARDGROUPS()],
    };
  } else {
    if (patreon) {
      // if there is a code in the query, render the patreon auth component
      if (query.code) {
        return AUTHORIZINGPATREON(query.code);
      } else {
        return PATREONAUTH();
      }
    } else {
      return SIGNUP();
    }
  }
};
