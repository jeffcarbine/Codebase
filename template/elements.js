class ELEMENT {
  constructor(params) {
    // if params is a string, then it's just textcontent
    if (typeof params === "string") {
      this.textContent = params;
      // if it is an object or an array...
    } else if (typeof params === "object") {
      if (Array.isArray(params)) {
        // if an array, then it's children
        this.children = this.children.concat(params);
      } else {
        // otherwise, it's regular properties
        for (let key in params) {
          this[key] = params[key];
        }
      }
    }
  }
}

export class HTML extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "html";
    this.lang = "en";
    this.children = [new TITLE(params.title), new VIEWPORT()];
  }
}

export class HEAD extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "head";
  }
}

export class TITLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "title";
  }
}

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

export class LINK extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "link";
  }
}

export class STYLESHEET extends LINK {
  constructor(params) {
    super(params);
    this.rel = "stylesheet";
  }
}

export class SCRIPT extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "script";
    this.defer = true;
  }
}

export class MODULE extends SCRIPT {
  constructor(params) {
    super(params);

    this.type = "module";
  }
}

export class BODY extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "body";
  }
}

export class HEADER extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "header";
  }
}

export class NAV extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "nav";
  }
}

export class MAIN extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "main";
  }
}

export class P extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "p";
  }
}

export class FOOTER extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "footer";
  }
}

export class IMG extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "img";
  }
}

export class LAZYIMG extends IMG {
  constructor(params) {
    super(params);

    this.loading = "lazy";
  }
}

export class UL extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "ul";
    this.children = [];

    for (let i = 0; i < params.children.length; i++) {
      const child = params.children[i];
      this.children.push(new LI(child));
    }
  }
}

export class LI extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "li";
  }
}

export class A extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "a";
  }
}

export class NAVIGATION {
  constructor(routes) {
    this.tagName = "nav";
    this.child = new UL({
      children: [],
    });
  }
}

export class SECTION extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "section";
  }
}

export class H1 extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "h1";
  }
}

export class TABLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "table";
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
  }
}

export class TFOOT extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "tfoot";
  }
}

export class INPUT extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "input";
  }
}

export class NUMBER extends INPUT {
  constructor(params) {
    super(params);
    this.type = "number";
  }
}

export class TEXT extends INPUT {
  constructor(params) {
    super(params);
    this.type = "text";
  }
}

export class EMAIL extends INPUT {
  constructor(params) {
    super(params);
    this.type = "email";
  }
}
