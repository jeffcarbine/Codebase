import { ELEMENT } from "../element.html.js";

export class SVG extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "svg";
  }
}
