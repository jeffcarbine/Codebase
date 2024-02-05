export class SKIPTOMAINCONTENT {
  constructor(params) {
    this.tagName = "button";

    this.id = "skipToMainContent";

    this["data-component"] = "skipToMainContent";

    this["data-query"] = params?.target || "main";

    this.tabIndex = 0;

    this.class = "btn primary";

    this.textContent = "Skip to Main Content";
  }
}
