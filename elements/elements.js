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

import { HTML } from "./html/html.element.js";
import { HEAD } from "./head/head.element.js";
import { TITLE } from "./title/title.element.js";
import { META, VIEWPORT } from "./meta/meta.element.js";
import { LINK, STYLESHEET } from "./link/link.element.js";
import { SCRIPT, MODULE } from "./script/script.element.js";
import { BODY } from "./body/body.element.js";
import { HEADER } from "./header/header.element.js";
import { LI } from "./li/li.element.js";
import { UL, ULLI } from "./ul/ul.element.js";
import { OL, OLLI } from "./ol/ol.element.js";
import { NAV, NAVIGATION } from "./nav/nav.element.js";
import { SPAN } from "./span/span.element.js";
import { STRONG } from "./strong/strong.element.js";
import { EM } from "./em/em.element.js";
import { P } from "./p/p.element.js";
import { MAIN } from "./main/main.element.js";
import { A } from "./a/a.element.js";
import { IMG, LAZYIMG } from "./img/img.element.js";
import { FIGURE, FIGCAPTION } from "./figure/figure.element.js";
import { SECTION } from "./section/section.element.js";
import { TABLE, THEAD, TBODY, TR, TH, TD } from "./table/table.element.js";
import { H1, H2, H3, H4, H5, H6 } from "./headings/headings.element.js";
import {
  INPUT,
  LABEL,
  LABELINPUT,
  TEXTAREA,
  LABELTEXTAREA,
  EMAIL,
  MESSAGE,
  FILE,
  HIDDEN,
  NUMBER,
  TEXT,
  PASSWORD,
  PHONE,
  DATE,
  RADIO,
  OPTION,
  SELECT,
  SELECTOPTION,
} from "./input/input.element.js";
import { BUTTON } from "./button/button.element.js";
import { FORM } from "./form/form.element.js";
import { BLOCKQUOTE } from "./blockquote/blockquote.element.js";
import { BR } from "./br/br.element.js";
import { DIALOG } from "./dialog/dialog.element.js";
import { ARTICLE } from "./article/article.element.js";
import { SVG } from "./svg/svg.element.js";

export {
  HTML,
  HEAD,
  TITLE,
  META,
  VIEWPORT,
  LINK,
  STYLESHEET,
  SCRIPT,
  MODULE,
  BODY,
  HEADER,
  LI,
  UL,
  ULLI,
  OL,
  OLLI,
  NAV,
  NAVIGATION,
  SPAN,
  STRONG,
  EM,
  P,
  MAIN,
  A,
  IMG,
  LAZYIMG,
  FIGURE,
  FIGCAPTION,
  SECTION,
  TABLE,
  THEAD,
  TBODY,
  TR,
  TH,
  TD,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  INPUT,
  LABEL,
  LABELINPUT,
  TEXTAREA,
  LABELTEXTAREA,
  EMAIL,
  MESSAGE,
  FILE,
  HIDDEN,
  NUMBER,
  TEXT,
  PASSWORD,
  PHONE,
  DATE,
  RADIO,
  OPTION,
  SELECT,
  SELECTOPTION,
  BUTTON,
  FORM,
  BLOCKQUOTE,
  BR,
  DIALOG,
  ARTICLE,
  SVG,
};
