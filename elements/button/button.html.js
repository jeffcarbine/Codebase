import { ELEMENT } from "../element.html.js";

export class BUTTON extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "button";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
