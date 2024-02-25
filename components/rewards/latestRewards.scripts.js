import { xhr } from "../../modules/xhr/xhr.js";
import { CARD } from "../../components/card/card.html.js";
import { H3, IMG, P } from "../../elements/elements.js";
import { renderTemplate } from "../../template/renderTemplate.js";
import { ICON, BTN, BTNCONTAINER } from "../components.js";
import { formatDateOrDaysAgo } from "../../modules/formatDate/formatDate.js";
import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";
import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

let latestRewardsIndex = 0,
  rewards;

const renderLatestRewards = () => {
  latestRewardsIndex += 3;

  const latestRewardsList = document.getElementById("latestRewardsList"),
    accessKeys = JSON.parse(latestRewardsList.dataset.accessKeys);

  latestRewardsList.classList.remove("loading");

  const generateAttachments = (reward) => {
    const attachmentsList = [],
      attachments = reward.attachments;

    // check to see if the user has access to the attachment
    attachments.forEach((attachment) => {
      if (attachment.accessGranted) {
        attachmentsList.push({
          class: "attachment",
          children: [
            {
              class: "icon-container",
              child: new ICON(attachment.type),
            },
            new P(attachment.title),
            new BTNCONTAINER(
              {
                class: "sm",
                href: `/rewards/reward/${reward._id}`,
                textContent: "View Reward",
              },
              "minimal"
            ),
          ],
        });
      } else {
        let patreonName = "Patreon",
          patreonUrl = "";

        accessKeys.forEach((key) => {
          if (key.value == reward.access_key) {
            patreonName = key.name;
            patreonUrl = key.url;
          }
        });

        const noAccessBtn = attachment.noAccessKey
          ? {
              class: "sm accent",
              textContent: `Join the ${patreonName} to Unlock for ${formatCents(
                attachment.price
              )}`,
              href: patreonUrl,
              target: "+blank",
            }
          : {
              class: "sm accent",
              textContent: `Reward Unlocked at ${formatCents(
                attachment.price
              )}`,
              href: "/rewards/pledge",
            };

        attachmentsList.push({
          class: "attachment locked",
          children: [
            {
              class: "icon-container",
              child: new ICON(attachment.type),
            },
            new P(attachment.title),
            new BTNCONTAINER(noAccessBtn, "minimal"),
          ],
        });
      }
    });

    return attachmentsList;
  };

  for (let i = latestRewardsIndex - 3; i < latestRewardsIndex; i++) {
    const reward = rewards[i];

    const card = CARD({
      body: {
        children: [
          {
            class: "info",
            children: [
              {
                if: reward.preview_src !== undefined,
                class: "previewImage",
                child: new IMG({
                  src: reward.preview_src,
                  alt: reward.preview_alt,
                }),
              },
              {
                class: "titleAndDate",
                children: [
                  new H3(reward.title),
                  new P({
                    class: "date",
                    textContent: formatDateOrDaysAgo(reward.published),
                  }),
                ],
              },
            ],
          },
          {
            class: "descriptionAndAttachments",
            children: [
              {
                class: "description",
                innerHTML: reward.description,
              },
              {
                class: "attachments",
                children: generateAttachments(reward),
              },
            ],
          },
        ],
      },
    });

    latestRewardsList.appendChild(renderTemplate(card));
  }
};

const getLatestRewards = () => {
  const success = (request) => {
    rewards = JSON.parse(request.responseText);

    renderLatestRewards();
  };

  xhr({ path: "/premmio/rewards/latest", success });
};

getLatestRewards();

const loadMoreLatestRewards = () => {
  renderLatestRewards();
};

addEventDelegate("click", "#loadMoreLatestRewards", loadMoreLatestRewards);
