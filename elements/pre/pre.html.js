import { ELEMENT } from "../element.html.js";

export class PRE extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "pre";
  }
}
