import { AUTHORIZINGPATREON, PATREONAUTH } from "../user/patreonAuth.html.js";
import { SELECTTIER } from "../user/selectTier.html.js";
import { SIGNUP } from "../user/signUp.html.js";
import { LATESTREWARDS } from "./latestRewards.html.js";

export const REWARDS = (data, patreon = false, accessKeys = []) => {
  const user = data.user,
    query = data.query;

  // render different things depending on the user's info
  if (user) {
    return {
      children: [LATESTREWARDS(accessKeys)],
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
