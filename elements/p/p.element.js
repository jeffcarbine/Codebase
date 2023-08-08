import { ELEMENT } from "../elements.js";

export class P extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "p";

    if (typeof params !== "object") {
      this.textContent = params;
    }
  }
}
