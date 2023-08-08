import { CARD } from "/periodic/components/card/card.component.js";
import * as e from "/periodic/elements/elements.js";
import * as c from "/periodic/components/components.js";
import { MODAL } from "/periodic/components/modal/modal.component.js";

export const datapointCardTemplate = (datasetId, datapoint) => {
  const generateCardContent = () => {
    const type = datapoint.type,
      cardContent = {
        children: [
          new e.H2(
            `${datapoint.name}${
              datapoint.active === false ? " (Inactive)" : ""
            }`
          ),
        ],
      };

    switch (type) {
      case "text":
        cardContent.children.push(new e.P(datapoint.text.value));
        break;
    }

    return cardContent;
  };

  return CARD({
    class: `datapoint style-inputs ${
      datapoint.active === false ? "inactive" : ""
    }`,
    children: [
      generateCardContent(),
      new c.BTNCONTAINER({
        "data-modal": "modal" + datapoint._id,
        children: [
          new c.ICON("edit"),
          new e.SPAN({ class: "text", textContent: "Edit" }),
        ],
      }),
      MODAL(
        {
          children: [
            new e.H2("Edit " + datapoint.name),
            {
              child: new e.FORM({
                method: "POST",
                action: "/admin/datapoints/edit",
                class: "editDatapoint style-inputs",
                children: datapointForms[datapoint.type](datasetId, datapoint),
              }),
            },
          ],
        },
        "modal" + datapoint._id
      ),
    ],
  });
};
