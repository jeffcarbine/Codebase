import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";

export const datapointListTemplate = ({
  id,
  exclude = [],
  model = "datapoint",
} = {}) => {
  return {
    class: "datapoint-list",
    "data-exclude": JSON.stringify(exclude),
    "data-id": id,
    "data-model": model,
  };
};

export const generateDatapointListItems = (
  datapoints,
  exclude,
  parentId,
  parentModel = "datapoint"
) => {
  const children = [];

  datapoints.forEach((datapoint) => {
    if (!exclude.includes(datapoint._id)) {
      const type = datapoint.type;

      const iconName = type !== "group" ? datapoint.type : datapoint.groupType;
      children.push(
        new e.LI([
          {
            class: "datapoint-icon",
            child: new c.ICON(iconName),
          },
          {
            class: "datapoint-name",
            child: new e.SPAN({
              textContent: datapoint.name,
            }),
          },
          new c.BTN({
            class: "sm addExistingDatapoint",
            "data-id": datapoint._id,
            "data-parentid": parentId,
            "data-parentmodel": parentModel,
            children: [new c.ICON("plus"), "Add"],
          }),
        ])
      );
    }
  });

  return new e.UL({
    class: "list",
    children,
  });
};
