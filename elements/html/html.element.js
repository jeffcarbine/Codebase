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
