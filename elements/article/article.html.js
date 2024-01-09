import { ELEMENT } from "../element.html.js";

export class ARTICLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "article";
  }
}
