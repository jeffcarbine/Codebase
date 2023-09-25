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

      // change how we pass the data to the li
      let data = child;

      if (typeof child === "object" && !Array.isArray(child)) {
        data = { child };
      }

      const li = new LI(data);

      this.children[i] = li;
    }
  }
}
