import { ELEMENT } from "../elements.js";

export class PRE extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "pre";
  }
}
