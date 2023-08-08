import { ELEMENT } from "../element.js";

export class SVG extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "svg";
  }
}
