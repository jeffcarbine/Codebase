import { BUTTON } from "../../elements/button/button.html.js";

export class NAVTOGGLE extends BUTTON {
  constructor(params) {
    super(params);
    this["data-component"] = "navToggle";
    this.id = "navToggle";
    this["aria-label"] = "Toggle Navigation";
    this["data-target"] = params["data-target"] || "nav";
  }
}
