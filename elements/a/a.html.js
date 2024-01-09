import { ELEMENT } from "../element.html.js";

export class A extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "a";
  }
}
