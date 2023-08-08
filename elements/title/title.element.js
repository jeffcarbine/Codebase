import { ELEMENT } from "../elements.js";

export class TITLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "title";
  }
}
