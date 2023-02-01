class ELEMENT {
  constructor(params) {
    // if params is a string, then it's just textcontent
    if (typeof params !== "object") {
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

    let children = [];

    for (let route in routes) {
      const path = routes[route];

      const navItem = new LI({
        child: new A({
          href: path,
          textContent: route,
        }),
      });

      children.push(navItem);
    }

    this.child = new UL({
      children,
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
