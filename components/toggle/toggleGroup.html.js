import { camelize } from "../../modules/formatString/formatString.js";
import { FIELDSET } from "../../elements/input/input.html.js";
import { SPAN } from "../../elements/span/span.html.js";

export const TOGGLEGROUP = ({
  label,
  className = "",
  name,
  values = [],
  checked,
} = {}) => {
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
      for: id,
      child: new SPAN(value),
    };

    children.push(label);
  });

  children.push({
    tagName: "span",
    class: "pill",
  });

  return {
    "data-component": "toggle",
    class: "toggle group " + className,
    children: [
      new FIELDSET({
        if: label !== undefined,
        textContent: label,
      }),
      {
        class: "radios",
        children,
      },
    ],
  };
};
