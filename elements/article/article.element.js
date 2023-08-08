import { ELEMENT } from "../element.js";

export class ARTICLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "article";
  }
}
