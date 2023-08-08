import { ELEMENT } from "../elements.js";

export class DIALOG extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "dialog";
  }
}
