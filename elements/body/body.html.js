import { ELEMENT } from "../element.html.js";

export class BODY extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "body";
  }
}
