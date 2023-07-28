import { cardTemplate } from "/periodic/components/card/card.template.js";
import * as e from "/periodic/elements/elements.js";
import { modalTemplate } from "/periodic/components/modal/modal.template.js";

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

  return cardTemplate({
    class: `datapoint style-inputs ${
      datapoint.active === false ? "inactive" : ""
    }`,
    children: [
      generateCardContent(),
      new e.BTNCONTAINER({
        "data-modal": "modal" + datapoint._id,
        children: [new e.ICON("edit"), "Edit"],
      }),
      modalTemplate(
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
