import { ELEMENT } from "../element.html.js";
import { LI } from "../li/li.html.js";

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
