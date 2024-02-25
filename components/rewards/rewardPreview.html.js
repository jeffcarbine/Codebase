import { H3, IMG, P } from "../../elements/elements.js";
import { formatCents } from "../../modules/formatCurrency/formatCurrency.js";
import { formatDateOrDaysAgo } from "../../modules/formatDate/formatDate.js";
import { BTNCONTAINER, CARD, ICON } from "../components.js";

const generateAttachments = (reward, accessKeys) => {
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
            textContent: `Reward Unlocked at ${formatCents(attachment.price)}`,
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

export const REWARDPREVIEW = (reward, accessKeys) => {
  return CARD({
    className: "rewardPreview",
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
              children: generateAttachments(reward, accessKeys),
            },
          ],
        },
      ],
    },
  });
};
