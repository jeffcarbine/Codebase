import { HEAD } from "../head/head.html.js";
import { BODY } from "../body/body.html.js";

export class HTML {
  constructor(params) {
    this.tagName = "html";
    this.lang = "en";
    if (params.style === undefined) {
      this.style = "display: none;"; // avoids FOUC
    } else {
      this.style = params.style;
    }

    if (params["data-theme"] !== undefined) {
      this["data-theme"] = params["data-theme"];
    }

    const defaultFavicons = [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/cdn/favicon/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/cdn/favicon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/cdn/favicon/favicon-16x16.png",
      },
      {
        rel: "manifest",
        href: "/cdn/favicon/site.webmanifest",
      },
    ];

    const head = new HEAD({
      title: params.title,
      metas: params.metas,
      links: params.links,
      stylesheets: params.stylesheets,
      scripts: params.scripts,
      favicons: params.favicons || defaultFavicons,
    });

    const body = new BODY(params.body);

    this.children = [head, body];
  }
}
