import { ELEMENT } from "../element.js";

export class SPAN extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "span";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
