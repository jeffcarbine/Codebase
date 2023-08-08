import { ELEMENT } from "../element.js";
import { LI } from "../li/li.element.js";

export class OL extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "ul";
  }
}

export class OLLI extends OL {
  constructor(params) {
    super(params);

    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];

      const li = new LI({ child });

      this.children[i] = li;
    }
  }
}
