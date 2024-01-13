import { STYLE, SCRIPT, LINK, STYLESHEET, TITLE, META } from "../elements.js";

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

    if (params.inlineStyles !== undefined) {
      const inlineStyles = new STYLE({
        textContent: params.inlineStyles,
      });

      this.children.push(inlineStyles);
    }
  }
}
