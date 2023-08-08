import { ELEMENT } from "../element.js";

export class A extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "a";
  }
}
