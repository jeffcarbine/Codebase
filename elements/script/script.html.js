import { ELEMENT } from "../element.html.js";

export class SCRIPT extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "script";
    this.defer = true;

    if (typeof params === "string") {
      this.src = params;
    }
  }
}

export class MODULE extends SCRIPT {
  constructor(params) {
    super(params);

    this.type = "module";
  }
}
