import { ELEMENT } from "../element.html.js";

export class TITLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "title";
  }
}
