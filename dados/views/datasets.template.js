import { base } from "./_dados.template.js";
import * as e from "../../elements/elements.js";
import { card } from "../../components/card/card.template.js";

export default (data) => {
  return base(
    data,
    {
      children: [
        new e.H1([new e.ICON("data"), "Datasets"]),
        new e.BTNCONTAINER(
          [
            {
              id: "addDataset",
              children: [new e.ICON("plus"), "Create Dataset"],
            },
          ],
          "centered"
        ),
        new e.SECTION({
          id: "datasets",
          class: "loading",
        }),
      ],
    },
    [
      new e.MODULE("/periodic/elements/input/_input.js"),
      new e.MODULE("/admin/scripts/datasets.js"),
    ]
  );
};
