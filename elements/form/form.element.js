import { ELEMENT } from "../elements.js";

export class FORM extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "form";
    this.method = params.method !== undefined ? params.method : "POST";
  }
}
