import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { SQUARE, ICON } from "../components.js";
import { IMG } from "../../elements/elements.js";

export class FIELD {
  constructor(params = {}) {
    // set the data-component attribute
    this["data-component"] = "field";

    // set the data-name attribute
    this["data-name"] = params.name;

    // default to text type if no type is provided
    const type = params.type || "text";

    // set the class name for object
    this.class = `field ${type}-field`;

    // create the input/textarea element
    let input = {
      tagName: "input",
    };

    // and change it to a textarea if necessary
    if (type === "textarea") {
      input.tagName = "textarea";

      // if no rows, default to 4
      if (!params.rows) {
        params.rows = 6;
      }
    } else if (type === "select") {
      input.tagName = "select";
    } else {
      // assign the type attribute
      input.type = type;
    }

    // if no id, but name then id = name
    if (!params.id && params.name) {
      params.id = params.name;
    } else {
      // otherwise generate a unique id
      params.id = generateUniqueId();
    }

    // all the keys we want to skip
    const skipKeys = ["type", "label", "preview", "options", "selected"];

    // assign all other params to the input
    for (let key in params) {
      if (!skipKeys.includes(key)) {
        input[key] = params[key];
      }
    }

    // if a select field, create the options
    if (type === "select") {
      input.children = [];

      params.options.forEach((option) => {
        const optionParams = {
          tagName: "option",
          value: camelize(option),
          textContent: option,
        };

        if (option === params.selected) {
          optionParams.selected = true;
        }

        input.children.push(optionParams);
      });
    }

    // put that inside of the input wrapper
    const wrapper = {
      class: "wrapper",
      children: [
        input,
        {
          tag: "span",
          class: "focus",
        },
      ],
    };

    // if this is a file, we need to create the base64file input
    if (type === "file") {
      const base64file = {
        tagName: "input",
        type: "hidden",
        name: params.name,
        value: params.value,
      };

      // and change the input's name to
      input.name = `${params.name}__File`;

      wrapper.children.push(base64file);
    }

    // if this is a simpledate, we need to create the hidden input
    if (type === "simpledate") {
      const hidden = {
        tagName: "input",
        type: "hidden",
        name: params.name,
      };

      // and change the input's name to
      input.name = `${params.name}__Date`;

      wrapper.children.push(hidden);
    }

    // create the label element
    const label = {
      tagName: "label",
      textContent: params.label,
      for: params.id,
    };

    // create the validation element
    const validation = {
      tagName: "span",
      class: "validation",
      "data-bind": `${params.name}--validation`,
    };

    // create the help element
    const help = {
      tagName: "span",
      class: "help",
      textContent: params.help || "",
      "data-bind": `${params.name}--help`,
    };

    // put the label second if checkbox or radio
    if (type === "checkbox" || type === "radio") {
      this.children = [wrapper, label, help, validation];
    } else {
      this.children = [label, wrapper, help, validation];
    }

    // if there is a preview, prepend it to the children
    if (type === "file" && params.preview === true) {
      input.class = `${
        input.class !== undefined ? input.class : ""
      } hasPreview`;

      const preview = {
        class: "preview",
        children: [
          new IMG({
            class: "imagePreview",
            style: "display: none;",
          }),
          {
            class: "placeholder",
            children: [new ICON("image"), SQUARE],
          },
        ],
      };

      // place the preview before the wrapper
      this.children.splice(1, 0, preview);
    }
  }
}
