import { ELEMENT } from "../elements.js";
import { UL } from "../ul/ul.element.js";
import { LI } from "../li/li.element.js";

export class NAV extends ELEMENT {
  constructor(params) {
    super(params);

    this.tagName = "nav";
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

        const path = routes[route] || "",
          basePath = params.basePath || "/";

        if (typeof path === "string") {
          const active =
            path === params.path ||
            (path !== "/" &&
              params.path !== undefined &&
              params.path.includes(path));

          navItem = new LI({
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (active ? " active" : ""),
            child: new A({
              href: path,
              textContent: route,
            }),
          });
          // then we have textcontent
        } else if (Array.isArray(path)) {
          // the href is always the first array element
          const href = path[0],
            children = path.slice(1);

          const active =
            href === params.path ||
            (href !== basePath &&
              params.path !== undefined &&
              params.path.includes(href));

          navItem = new LI({
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (active ? " active" : ""),
            child: new A({
              href,
              children,
            }),
          });
        } else {
          // check
          const childActive = Object.values(path).includes(params.path);

          navItem = new LI({
            class:
              route.toLowerCase().replaceAll(" ", "") +
              (childActive ? " active" : ""),
            children: [
              new BUTTON(route),
              {
                class: "submenu",
                child: new UL(createNavItems(path)),
              },
            ],
          });
        }

        navItems.push(navItem);
      }

      return navItems;
    };

    const ul = new UL(createNavItems(params.routes));
    this.children.unshift(ul);
  }
}
