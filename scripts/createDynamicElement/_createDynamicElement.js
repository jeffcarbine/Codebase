/**
 * Create Dynamic Element
 * Allows you to better create HTML elements via Javascript with classes, ids and attributes
 * @param {object} obj the element object
 * @example
 * createElement({
 *  tagName: "p",
 *  className: "test",
 *  id: "test",
 *  "data-foo": "bar",
 *  children: [
 *      {
 *          tagName: "span",
 *          textContent: "hello world"
 *      },
 *      {
 *          tagName: "a",
 *          href: "http://google.com",
 *          textContent: "a link"
 *      }
 *  ]
 * })
 */

export const createDynamicElement = (obj) => {
  var element;

  if (obj.tagName !== undefined) {
    element = document.createElement(obj.tagName);
  } else if (obj.icon) {
    element = "";
  } else {
    element = document.createElement("div");
  }

  if (obj.icon) {
    // this is an icon, so we can ignore the rest
    const icon = obj.icon;

    // there should only be one key/value pair, but we
    // use a loop cause I don't know of a cleaner way to
    // do this
    for (let iconName in icon) {
      const iconString = icon[iconName],
        markup =
          "<svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 320.27 316.32'>" +
          iconString.replace(/cls/g, iconName) +
          "</svg>";

      element = new DOMParser().parseFromString(markup, "text/xml").firstChild;

      element.classList = "icon icon-" + iconName;
    }
  } else {
    for (var key in obj) {
      const value = obj[key];

      if (value !== null) {
        if (
          key !== "children" &&
          key !== "prepend" &&
          key !== "append" &&
          key !== "child" &&
          key !== "tagName" &&
          key !== "textContent" &&
          key !== "innerHTML" &&
          key !== "if"
        ) {
          element.setAttribute(key, value);
        } else if (key === "if") {
          // then this is conditional on the if value being true
          const isTrue = value;

          // if not true, return a null value
          if (!isTrue) {
            return null;
          }
        } else if (key === "textContent") {
          element.textContent = value;
        } else if (
          key === "prepend" ||
          key === "append" ||
          key === "children"
        ) {
          let children = value;

          for (var i = 0; i < children.length; i++) {
            let child = children[i];

            let childElement = createDynamicElement(child);

            if (key === "children" || key === "append") {
              if (childElement !== null) {
                element.appendChild(childElement);
              }
            } else if (key === "prepend") {
              if (childElement !== null) {
                element.prepend(childElement);
              }
            }
          }
        } else if (key === "child") {
          let child = value;

          let childElement = createDynamicElement(child);
          if (childElement !== null) {
            element.appendChild(childElement);
          }
        } else if (key === "innerHTML") {
          element.innerHTML = value;
        }
      }
    }
  }

  return element;
};

// element class shorthands

class ELEMENT {
  constructor(params) {
    // if params is a string, then it's just textcontent
    if (typeof params !== "object") {
      this.textContent = params;
      // if it is an object or an array...
    } else if (typeof params === "object") {
      if (Array.isArray(params)) {
        // if an array, then it's children
        this.children = params;
      } else {
        // otherwise, it's regular properties
        for (let key in params) {
          this[key] = params[key];
        }
      }
    }
  }
}

export class TABLE extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "table";
  }
}

export class THEAD extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "thead";
  }
}

export class TH extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "th";
  }
}

export class TR extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "tr";
  }
}

export class TBODY extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "tbody";
  }
}

export class TD extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "td";
  }
}

export class TFOOT extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "tfoot";
  }
}

export class INPUT extends ELEMENT {
  constructor(params) {
    super(params);
    this.tagName = "input";
  }
}

export class NUMBER extends INPUT {
  constructor(params) {
    super(params);
    this.type = "number";
  }
}

export class TEXT extends INPUT {
  constructor(params) {
    super(params);
    this.type = "text";
  }
}

export class EMAIL extends INPUT {
  constructor(params) {
    super(params);
    this.type = "email";
  }
}

// export class TABLE {
//   constructor(thead, tbody) {
//     this.tagName = "table";
//     this.childen = [
//       {
//         tagName: "thead",
//         child: {
//           tagName: "tr",
//           children: thead,
//         },
//       },
//       {
//         tagName: "tbody",
//         children: tbody,
//       },
//     ];
//   }
// }
