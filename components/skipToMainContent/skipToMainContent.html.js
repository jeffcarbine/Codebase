import { SPAN } from "../../elements/span/span.html.js";
export class SKIPTOMAINCONTENT {
  constructor(params) {
    this.tagName = "button";

    this.id = "skipToMainContent";

    this["data-component"] = "skipToMainContent";

    this["data-query"] = params?.target || "main";

    this.tabIndex = 0;

    this.class = "btn primary";

    this.child = new SPAN({
      textContent: "Skip to Main Content",
    });
  }
}
