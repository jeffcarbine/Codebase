import { ELEMENT } from "../element.js";

export class LINK extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "link";

    if (typeof params === "string") {
      this.href = params;
    }
  }
}

export class STYLESHEET extends LINK {
  constructor(params) {
    super(params);
    this.rel = "stylesheet";
  }
}
