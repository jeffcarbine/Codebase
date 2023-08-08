import { ELEMENT } from "../elements.js";

export class BODY extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "body";
  }
}
