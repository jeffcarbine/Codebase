import { ELEMENT } from "../element.js";

export class FIGURE extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "figure";
  }
}

export class FIGCAPTION extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "figcaption";
  }
}
