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
