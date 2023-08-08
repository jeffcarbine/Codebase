import { ELEMENT } from "../element.js";

export class IMG extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "img";

    if (typeof params === "string") {
      this.src = params;
    }
  }
}

export class LAZYIMG extends IMG {
  constructor(params) {
    super(params);

    this.loading = "lazy";
  }
}
