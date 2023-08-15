import { PRE } from "../../elements/pre/pre.element.js";
import { htmlize } from "../../modules/formatString/formatString.js";

export class CODEBLOCK extends PRE {
  constructor(params) {
    super(params);

    this.child = {
      class: "code",
      textContent: htmlize(params),
    };
  }
}
