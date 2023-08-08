import { ELEMENT } from "../element.js";

export class H1 extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "h1";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H2 extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "h2";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H3 extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "h3";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H4 extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "h4";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H5 extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "h5";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class H6 extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "h5";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}
