import { camelize } from "../../modules/formatString/formatString.js";

export const toggleGroupTemplate = ({ name, values = [] }) => {
  const children = [];

  values.forEach((value) => {
    const id = `${name}-${value}`;

    // create the radio
    const radio = {
      tagName: "input",
      type: "radio",
      name,
      value: camelize(value),
      id,
    };

    children.push(radio);

    // create the label
    const label = {
      tagName: "label",
      textContent: value,
      for: id,
    };

    children.push(label);
  });

  children.push({
    tagName: "span",
    class: "switch",
  });

  return {
    class: "toggle group",
    children,
  };
};
