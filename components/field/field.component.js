import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";
import { camelize } from "../../modules/formatString/formatString.js";
import { SQUARE, ICON } from "../components.js";
import { BUTTON, IMG, LI, SPAN, UL, ULLI } from "../../elements/elements.js";

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

    // if it is a date, format the value
    if (type === "date") {
      params.value = params.value
        ? new Date(params.value).toISOString().split("T")[0]
        : "";
    }

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

    // if a select field, create the options
    if (type === "select") {
      input.children = [];

      const optionValue = (option) => {
        if (typeof option === "string") {
          return camelize(option);
        } else if (typeof option === "number") {
          return option;
        } else {
          return option.value;
        }
      };

      params.options.forEach((option) => {
        const optionParams = {
          tagName: "option",
          value: optionValue(option),
          textContent:
            typeof option === "string" || typeof option === "number"
              ? option
              : option.name,
        };

        if (params.selected !== undefined) {
          if (option === params.selected || option.value === params.selected) {
            optionParams.selected = true;
          }
        }

        input.children.unshift(optionParams);
      });

      // and add the faux select span
      const fauxSelect = new SPAN({
        class: "faux-select",
      });

      wrapper.children.push(fauxSelect);
    }

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
      "data-bind": `${params.name}--help`,
    };

    // check the type of help that is coming in
    if (typeof params.help === "string") {
      help.textContent = params.help;
    } else if (Array.isArray(params.help)) {
      help.children = params.help;
    } else if (typeof params.help === "object") {
      help.child = params.help;
    }

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
            style: params.value !== undefined ? "" : `display: "none"`,
            src: params.value || "",
          }),
          {
            class: "placeholder",
            children: [new ICON("image")],
          },
        ],
      };

      // place the preview before the wrapper
      this.children.splice(1, 0, preview);
    }

    // if this is a reorganize, then make the input hidden
    // and add the reorganize ui
    if (type === "reorder") {
      input.type = "hidden";

      const generateReorganizeListItems = () => {
        const arr = Array.isArray(params.value)
            ? params.value
            : params.value.split(","),
          reorganizeListItems = [];

        arr.forEach((item, index) => {
          const listItem = new LI({
            class: "reorderItem",
            "data-originalindex": index,
            "data-value": item,
            children: [
              {
                class: "handle",
                role: "button",
                "aria-label": "Drag item",
                child: new ICON("dragHandle"),
              },
              new SPAN(item),
            ],
          });

          reorganizeListItems.push(listItem);
        });

        return reorganizeListItems;
      };

      const reorganizeList = new UL({
        class: "reorderList",
        children: generateReorganizeListItems(),
      });

      // and add it to the wrapper
      wrapper.children.unshift(reorganizeList);

      // and add an overflow-visible class
      wrapper.class += " overflow-visible";
    }
  }
}
