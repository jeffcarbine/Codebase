import { ELEMENT } from "../elements.js";

export class SVG extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "svg";
  }
}
