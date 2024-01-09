import { ELEMENT } from "../element.html.js";

export class P extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "p";

    if (typeof params !== "object") {
      this.textContent = params;
    }
  }
}
