import { xhr } from "../../modules/xhr/xhr.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { REWARDGROUP } from "./rewardGroups.html.js";

const success = (request) => {
  const rewardGroupsList = document.querySelector("#rewardGroupsList");
  rewardGroupsList.classList.remove("loading");

  const rewards = JSON.parse(request.response);

  rewards.forEach((reward) => {
    const rewardGroup = REWARDGROUP(reward);

    rewardGroupsList.appendChild(renderTemplate(rewardGroup));
  });
};

xhr({ path: "/premmio/rewards/retrieveGroups", success });
