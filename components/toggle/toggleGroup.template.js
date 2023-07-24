import { camelize } from "../../modules/formatString/formatString.js";

export const toggleGroupTemplate = ({ name, values = [], checked }) => {
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

    if (checked === value) {
      radio.checked = true;
    }

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
    class: "pill",
  });

  return {
    class: "toggle group",
    children,
  };
};
