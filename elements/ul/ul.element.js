import { ELEMENT } from "../element.js";
import { LI } from "../li/li.element.js";

export class UL extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "ul";
  }
}

export class ULLI extends UL {
  constructor(params) {
    super(params);

    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];

      const li = new LI({ child });

      this.children[i] = li;
    }
  }
}
