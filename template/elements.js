class ELEMENT {
  constructor(params) {
    // we allow other classes to define what they do
    // with non-object params
    if (typeof params === "object") {
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
    this.style = "display: none;"; // avoids FOUC

    const head = new HEAD({
      title: params.title,
      metas: params.metas,
      links: params.links,
      stylesheets: params.stylesheets,
      scripts: params.scripts,
    });

    this.children.unshift(head);
  }
}

export class HEAD extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "head";
    this.children = [];

    if (params.title !== undefined) {
      const title = new TITLE({
        textContent: params.title,
      });

      this.children.push(title);
    }

    if (params.metas !== undefined && Array.isArray(params.metas)) {
      for (let i = 0; i < params.metas.length; i++) {
        const meta = params.metas[i];

        const metaTag = new META({
          name: meta.name,
          content: meta.content,
        });

        this.children.push(metaTag);
      }
    }

    if (params.links !== undefined && Array.isArray(params.links)) {
      for (let i = 0; i < params.links.length; i++) {
        const link = params.links[i],
          linkTag = new LINK();

        for (let key in link) {
          linkTag[key] = link[key];
        }

        this.children.push(linkTag);
      }
    }

    if (params.stylesheets !== undefined && Array.isArray(params.stylesheets)) {
      for (let i = 0; i < params.stylesheets.length; i++) {
        const stylesheet = params.stylesheets[i],
          stylesheetTag = new STYLESHEET({
            href: stylesheet,
          });

        this.children.push(stylesheetTag);
      }
    }

    if (params.scripts !== undefined && Array.isArray(params.scripts)) {
      for (let i = 0; i < params.scripts.length; i++) {
        const script = params.scripts[i],
          scriptTag = new SCRIPT();

        for (let key in script) {
          scriptTag[key] = script[key];
        }

        this.children.push(scriptTag);
      }
    }
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

    if (typeof params === "string") {
      this.href = params;
    }
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

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class SPAN extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "span";

    if (typeof params === "string") {
      this.textContent = params;
    }
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

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class A extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "a";
  }
}

export class NAVIGATION extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "nav";
    this.children = params.children || [];

    const ul = new UL({
      children: [],
    });

    for (let route in params.routes) {
      const path = params.routes[route];

      const navItem = new LI({
        child: new A({
          href: path,
          textContent: route,
        }),
      });

      ul.children.push(navItem);
    }

    this.children.unshift(ul);
  }
}

export class NAVTOGGLE extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "button";
    this.id = "navToggle";
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

export class INPUT extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "input";
  }
}

export class LABEL extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "label";
  }
}

export class NUMBER {
  constructor({ type = "number" } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type });
  }
}

export class TEXT {
  constructor({ type = "text" } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type });
  }
}

export class EMAIL {
  constructor({
    type = "email",
    name = "email",
    id = "email",
    label = "Email",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, name, id });
  }
}

export class PASSWORD {
  constructor({
    type = "password",
    name = "password",
    id = "password",
    label = "Password",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, name, id });
  }
}

export class BUTTON extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "button";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class BTN extends ELEMENT {
  constructor(params) {
    super(params);

    if (params.href !== undefined) {
      this.tagName = "a";
    } else {
      this.tagName = "btn";
    }

    this.class = "btn" + (params.class !== undefined ? " " + params.class : "");
  }
}

export class FORM extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "form";
    this.method = params.method !== undefined ? params.method : "POST";
  }
}
