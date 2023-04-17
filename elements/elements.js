import { capitalizeAll } from "../scripts/formatString/formatString.js";
import * as i from "../components/icon/_icon-list.js";

export class ELEMENT {
  constructor(params) {
    // we allow other classes to define what they do
    // with non-object params
    if (typeof params === "object") {
      if (Array.isArray(params)) {
        // if an array, then it's children
        this.children =
          this.children !== undefined ? this.children.concat(params) : params;
      } else {
        // otherwise, it's regular properties
        for (let key in params) {
          this[key] = params[key];
        }
      }
    }
  }
}

export class HTML {
  constructor(params) {
    this.tagName = "html";
    this.lang = "en";
    this.style = "display: none;"; // avoids FOUC

    const head = new HEAD({
      title: params.title,
      metas: params.metas,
      links: params.links,
      stylesheets: params.stylesheets,
      scripts: params.scripts,
      favicons: params.favicons,
    });

    const body = new BODY(params.body);

    this.children = [head, body];
  }
}

export class HEAD {
  constructor(params) {
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
          scriptTag = new SCRIPT(script);

        this.children.push(scriptTag);
      }
    }

    if (params.favicons !== undefined && Array.isArray(params.favicons)) {
      for (let i = 0; i < params.favicons.length; i++) {
        const favicon = params.favicons[i],
          faviconTag = new LINK(favicon);

        this.children.push(faviconTag);
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

    if (typeof params !== "object") {
      this.textContent = params;
    }
  }
}
export class EM extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "em";

    if (typeof params !== "object") {
      this.textContent = params;
    }
  }
}

export class STRONG extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "strong";

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
  }
}

export class ULLI extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "ul";

    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i];

      const li = new LI(child);

      this.children[i] = li;
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

    const createNavItems = (routes) => {
      const navItems = [];

      for (let route in routes) {
        let navItem;

        const path = routes[route];

        if (typeof path === "string") {
          const active = path === params.path;
          navItem = {
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (active ? " active" : ""),
            child: new A({
              href: path,
              textContent: route,
            }),
          };
          // then we have textcontent
        } else if (Array.isArray(path)) {
          // the href is always the first array element
          const href = path[0],
            children = path.slice(1);

          const active = href === params.path;

          navItem = {
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (active ? " active" : ""),
            child: new A({
              href,
              children,
            }),
          };
        } else {
          // this is a submenu

          // check
          const childActive = Object.values(path).includes(params.path);

          navItem = {
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (childActive ? " active" : ""),
            children: [
              new BUTTON(route),
              {
                class: "submenu",
                child: new ULLI(createNavItems(path)),
              },
            ],
          };
        }

        navItems.push(navItem);
      }

      return navItems;
    };

    const ul = new ULLI(createNavItems(params.routes));
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

export class HIDDEN extends INPUT {
  constructor(params) {
    super(params);

    this.type = "hidden";
  }
}

export class NUMBER {
  constructor({ type = "number", value = 0 } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, value });
  }
}

export class TEXT {
  constructor(params) {
    let inputParams = {},
      labelText;

    if (typeof params === "string") {
      inputParams.name = params;
      inputParams.id = params;
      labelText = capitalizeAll(params);
    } else {
      inputParams = params;
      labelText = params.label;
    }

    this.tagName = "label";
    this.textContent = labelText;
    this.child = new INPUT(inputParams);
  }
}

export class EMAIL {
  constructor({
    type = "email",
    name = "email",
    id = "email",
    label = "Email",
    value = "",
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
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, name, id });
  }
}

export class PHONE {
  constructor({
    type = "tel",
    name = "phone",
    id = "phone",
    label = "Phone",
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, name, id });
  }
}

export class TEXTAREA extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "textarea";
    this.rows = params.rows || 4;
  }
}

export class DATE {
  constructor({
    type = "date",
    name = "date",
    id = "date",
    label = "Date",
    value = "",
  } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new INPUT({ type, name, id, value });
  }
}

export class MESSAGE {
  constructor({ name = "message", id = "message", label = "Message" } = {}) {
    this.tagName = "label";
    this.textContent = label;
    this.child = new TEXTAREA({ name, id });
  }
}

export class RADIO {
  constructor(params) {
    params.type = "radio";
    this.class = "radio";

    this.children = [
      new INPUT(params),
      new LABEL({
        textContent: params.label,
        for: params.id,
      }),
    ];
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

// export class BTN extends ELEMENT {
//   constructor(params) {
//     super(params);

//     if (params.href !== undefined) {
//       this.tagName = "a";
//     } else {
//       this.tagName = "button";
//     }

//     if (typeof params === "string") {
//       this.textContent = params;
//     }

//     this.class = "btn" + (params.class !== undefined ? " " + params.class : "");
//   }
// }

export class BTN {
  constructor(params) {
    // check if we have a href
    if (params.href !== undefined) {
      this.tagName = "a";
    } else {
      this.tagName = "button";
    }

    // create the span that will live inside the btn
    let span = new SPAN();

    // check if is object/array
    if (typeof params === "object") {
      if (Array.isArray(params)) {
        // if an array, then it's children
        span.children =
          this.children !== undefined ? this.children.concat(params) : params;
      } else {
        // otherwise, it's regular properties
        for (let key in params) {
          if (key !== "textContent" && key !== "children" && key !== "child") {
            this[key] = params[key];
          } else {
            span[key] = params[key];
          }
        }
      }
    } else {
      // if it is just a string, it is the textContent
      span.textContent = params;
    }

    // add the btn class
    this.class += " btn";

    // and now make the span the only child of the btn
    this.child = span;
  }
}

export class BTNCONTAINER {
  constructor(params, className = null) {
    this.class = "btn-container " + className;
    this.children = [];

    const btns = Array.isArray(params) ? params : [params];

    for (let i = 0; i < btns.length; i++) {
      const markup = btns[i],
        btn = new BTN(markup);

      this.children.push(btn);
    }
  }
}

export class FORM extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "form";
    this.method = params.method !== undefined ? params.method : "POST";
  }
}

export class BLOCKQUOTE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "blockquote";

    if (typeof params === "string") {
      this.textContent = params;
    }
  }
}

export class BR extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "br";
  }
}

export class ICON {
  constructor(params) {
    this.icon = i[params];
  }
}

export class DIALOG extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "dialog";
  }
}

export class ARTICLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "article";
  }
}
