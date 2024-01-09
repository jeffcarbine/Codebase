import { ELEMENT } from "../element.html.js";

export class LI extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "li";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
