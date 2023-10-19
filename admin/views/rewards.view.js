import { base } from "./admin.view.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export default (data) => {
  return base(
    data,
    {
      id: "rewards",
      children: [
        new e.H1([new c.ICON("gift"), "Rewards"]),
        new e.SECTION({
          id: "rewardList",
          class: "card-canvas loading",
        }),
      ],
    },
    [new e.MODULE("/periodic/admin/scripts/rewards.scripts.js")]
  );
};
