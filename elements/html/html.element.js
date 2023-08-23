import { HEAD } from "../head/head.element.js";
import { BODY } from "../body/body.element.js";

export class HTML {
  constructor(params) {
    this.tagName = "html";
    this.lang = "en";
    if (params.style === undefined) {
      this.style = "display: none;"; // avoids FOUC
    } else {
      this.style = params.style;
    }

    const defaultFavicons = [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "http://d1xqupojasbi0m.cloudfront.net/images/favicon/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "http://d1xqupojasbi0m.cloudfront.net/images/favicon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "http://d1xqupojasbi0m.cloudfront.net/images/favicon/favicon-16x16.png",
      },
      {
        rel: "manifest",
        href: "http://d1xqupojasbi0m.cloudfront.net/images/favicon/site.webmanifest",
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
