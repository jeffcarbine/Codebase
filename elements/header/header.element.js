import { ELEMENT } from "../elements.js";

export class HEADER extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "header";
  }
}
