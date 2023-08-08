import { ELEMENT } from "../elements.js";

export class ARTICLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "article";
  }
}
