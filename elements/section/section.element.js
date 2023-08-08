import { ELEMENT } from "../elements.js";

export class SECTION extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "section";
  }
}
