import { ELEMENT } from "../element.html.js";
import {
  camelize,
  capitalizeAll,
  capitalize,
} from "../../modules/formatString/formatString.js";

export class INPUT extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "input";

    if (typeof params === "string") {
      this.name = params;
      this.id = params;
    }
  }
}

export class LABEL extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "label";
  }
}

export class FIELDSET extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "fieldset";
  }
}

export class LEGEND extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "legend";
  }
}

export class LABELINPUT {
  constructor(params) {
    this.if = params.if;

    let inputParams = {},
      labelText;

    if (typeof params === "string") {
      inputParams.name = camelize(params);
      inputParams.id = camelize(params);
      labelText = capitalizeAll(params);
    } else {
      inputParams = params;
      labelText = params.label;
    }

    if (params.value !== undefined && params.value !== "") {
      this.class = "active";
    }

    this.tagName = "label";
    this.textContent = labelText;
    this.child = new INPUT(inputParams);
  }
}
export class TEXTAREA extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "textarea";
    this.rows = params.rows || 5;

    if (typeof params === "string") {
      this.name = params;
      this.id = params;
    }
  }
}

export class LABELTEXTAREA {
  constructor(params) {
    this.if = params.if;

    let textareaParams = {},
      labelText;

    if (typeof params === "string") {
      textareaParams.name = camelize(params);
      textareaParams.id = camelize(params);
      labelText = capitalizeAll(params);
    } else {
      textareaParams = params;
      labelText = params.label;
    }

    if (params.value !== undefined && params.value !== "") {
      this.class = "active";
    }

    this.tagName = "label";
    this.textContent = labelText;
    this.child = new TEXTAREA(textareaParams);
  }
}

export class EMAIL extends LABELINPUT {
  constructor(params = {}) {
    params.type = "email";

    if (params.name === undefined) {
      params.name = "email";
    }

    if (params.id === undefined) {
      params.id = "email";
    }

    if (params.label === undefined) {
      params.label = "Email";
    }

    super(params);
  }
}

export class MESSAGE extends LABELTEXTAREA {
  constructor(params) {
    if (params.name === undefined) {
      params.name = "message";
    }

    if (params.id === undefined) {
      params.id = "message";
    }

    if (params.label === undefined) {
      params.label = "Message";
    }

    super(params);
  }
}

export class FILE extends INPUT {
  constructor(params) {
    super(params);
    this.type = "file";
  }
}

export class HIDDEN extends INPUT {
  constructor(params) {
    super(params);

    this.type = "hidden";
  }
}

export class NUMBER {
  constructor({ type = "number", value = 0 } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, value });
  }
}

export class TEXT {
  constructor(params) {
    this.if = params.if;

    let inputParams = {},
      labelText;

    if (typeof params === "string") {
      inputParams.name = camelize(params);
      inputParams.id = camelize(params);
      labelText = capitalizeAll(params);
    } else {
      inputParams = params;
      labelText = params.label;
    }

    if (params.value !== undefined && params.value !== "") {
      this.class = "active";
    }

    this.tagName = "label";
    this.textContent = labelText;
    this.child = new INPUT(inputParams);
  }
}
export class PASSWORD {
  constructor({
    type = "password",
    name = "password",
    id = "password",
    label = "Password",
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, name, id });
  }
}

export class PHONE {
  constructor({
    type = "tel",
    name = "phone",
    id = "phone",
    label = "Phone",
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, name, id });
  }
}

export class DATE {
  constructor({
    type = "date",
    name = "date",
    id = "date",
    label = "Date",
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, name, id, value });
  }
}

export class OPTION {
  constructor(params) {
    this.tagName = "option";

    if (typeof params === "string") {
      this.value = params;
      this.textContent = capitalizeAll(params);
    } else {
      for (let key in params) {
        this[key] = params[key];
      }
    }
  }
}

export class SELECT extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "select";
  }
}

export class SELECTOPTION extends SELECT {
  constructor(params) {
    super(params);

    const options = [];

    this.children.forEach((child) => {
      let option;

      if (typeof child === "string") {
        option = new OPTION({
          textContent: capitalize(child),
          value: camelize(child),
        });
      } else {
        option = new OPTION({
          textContent: child.title,
          value: child.value,
        });
      }

      if (child === params.selected) {
        option.selected = true;
      }

      options.push(option);
    });

    this.children = options;
  }
}

export class CHECKBOX extends INPUT {
  constructor(params) {
    super(params);

    this.type = "checkbox";

    if (params.id === undefined) {
      this.id = params.value;
    }
  }
}

export class CHECKBOXLABEL {
  constructor(params) {
    this.class = "checkboxLabel";

    if (params.id === undefined) {
      params.id = params.value;
    }

    this.children = [
      new CHECKBOX(params),
      new LABEL({
        textContent: params.label,
        for: params.id,
      }),
    ];
  }
}

export class RADIO extends INPUT {
  constructor(params) {
    super(params);

    this.type = "radio";

    if (params.id === undefined) {
      this.id = params.value;
    }
  }
}

export class RADIOLABEL {
  constructor(params) {
    this.class = `radioLabel ${params.class}`;
    // clear out params.class
    delete params.class;

    // set up the label
    const labelText = params.label,
      labelClass = params.labelClass;

    // create a data attribute for the input
    params["data-label"] = labelText;

    // clear out params.label
    delete params.label;
    delete params.labelClass;

    if (params.id === undefined) {
      params.id = params.value;
    }

    this.children = [
      new RADIO(params),
      new LABEL({
        textContent: labelText,
        class: labelClass,
        for: params.id,
      }),
    ];
  }
}
