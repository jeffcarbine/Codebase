import { ELEMENT } from "../element.js";

export class META extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "meta";
  }
}

export class VIEWPORT extends META {
  constructor(params) {
    super(params);
    this.name = "viewport";
    this.content = "width=device-width, initial-scale=1";
  }
}
