import { SPAN } from "../../elements/span/span.element.js";
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
    this.class = this.class !== undefined ? (this.class += " btn") : "btn";

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
