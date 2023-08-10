import { ELEMENT } from "../element.js";

export class TABLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "table";
  }
}

export class CAPTION extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "caption";
  }
}

export class THEAD extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "thead";
  }
}

export class TH extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "th";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class TR extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "tr";
  }
}

export class TBODY extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "tbody";
  }
}

export class TD extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "td";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class TFOOT extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "tfoot";
  }
}
