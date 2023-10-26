import { BUTTON } from "../../elements/button/button.element.js";

export class NAVTOGGLE extends BUTTON {
  constructor(params) {
    super(params);
    this["data-component"] = "navToggle";
    this.id = "navToggle";
    this["aria-label"] = "Toggle Navigation";
  }
}
