import { ELEMENT } from "../elements.js";

export class BR extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "br";
  }
}
