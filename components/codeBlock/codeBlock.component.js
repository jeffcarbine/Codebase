import { PRE } from "../../elements/pre/pre.element";

export class CODEBLOCK extends PRE {
  constructor(params) {
    super(params);

    this.child = {
      class: "code",
      textContent: htmlize(params),
    };
  }
}
