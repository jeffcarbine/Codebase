import { ELEMENT } from "../element.html.js";

export class STYLE extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "style";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
