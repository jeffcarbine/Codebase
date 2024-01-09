import { ELEMENT } from "../element.html.js";

export class EM extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "em";

    if (typeof params !== "object") {
      this.textContent = params;
    }
  }
}
