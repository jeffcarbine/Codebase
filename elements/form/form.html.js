import { ELEMENT } from "../element.html.js";

export class FORM extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "form";
    this.method = params.method !== undefined ? params.method : "POST";
  }
}
