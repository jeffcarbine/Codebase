import { ELEMENT } from "../element.js";

export class BLOCKQUOTE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "blockquote";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
