import { ELEMENT } from "../element.html.js";

export class BR extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "br";
  }
}
