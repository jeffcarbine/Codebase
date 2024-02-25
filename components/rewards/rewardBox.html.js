import { A, H2, H3, IMG, P } from "../../elements/elements.js";
import { formatDateOrDaysAgo } from "../../modules/formatDate/formatDate.js";

export const REWARDBOX = (reward) => {
  return new A({
    href: `/rewards/reward/${reward.id}`,
    class: "rewardBox",
    "data-tags": reward.tags.join(" "),
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
              new H2(reward.title),
              new P({
                class: "date",
                textContent: formatDateOrDaysAgo(reward.published),
              }),
            ],
          },
        ],
      },
      // {
      //   class: "description",
      //   children: [
      //     {
      //       class: "description",
      //       innerHTML: reward.description,
      //     },
      //   ],
      // },
    ],
  });
};
