import { ELEMENT } from "../element.js";

export class FORM extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "form";
    this.method = params.method !== undefined ? params.method : "POST";
  }
}
