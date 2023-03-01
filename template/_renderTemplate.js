import * as i from "../components/icon/_icon-list.js";

export const renderTemplate = (obj, isServer = false) => {
  // TODO: check for an if property, and don't return
  // anything if the if is false

  // start by creating the element
  let element;

  // check to see if the obj has an "if" property, and check if it is true
  // or not - if not true, they we just don't render anything
  if (obj.if !== undefined) {
    // then check it if is false
    if (!obj.if) {
      if (isServer) {
        return "";
      } else {
        return null;
      }
    }
  }

  // if this is just a string and not actually an object,
  // the we just need to return the text
  if (typeof obj === "string") {
    if (isServer) {
      return obj;
    } else {
      element = document.createTextNode(obj);
      return element;
    }
  }

  // if this is the server, we need to output a string,
  // otherwise we'll use the document.createElement for
  // the frontend
  if (isServer) {
    element = "<";
  }

  // set the tagName
  let tagName = "div";
  if (obj.tagName !== undefined) {
    tagName = obj.tagName;
  }

  if (obj.icon === undefined) {
    // assign the tagName
    if (isServer) {
      // pass that as the first part of the html string
      element += tagName;
    } else {
      // create that element
      element = document.createElement(tagName);
    }
  }

  if (obj.icon) {
    // this is an icon, so we can ignore the rest
    const icon = obj.icon;

    // there should only be one key/value pair, but we
    // use a loop cause I don't know of a cleaner way to
    // do this
    for (let iconName in icon) {
      const iconString = i[icon],
        markup =
          "<svg class='icon icon-" +
          iconName +
          "' xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 320.27 316.32'>" +
          iconString.replace(/cls/g, iconName) +
          "</svg>";

      if (isServer) {
        element = markup;
      } else {
        element = new DOMParser().parseFromString(
          markup,
          "text/xml"
        ).firstChild;
      }
    }
  } else {
    // go through every key/value pair that is
    // an html property
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
          if (isServer) {
            element = element + " " + key + "='" + value + "'";
          } else {
            element.setAttribute(key, value);
          }
        }
      }
    }

    // now we've made it through the first tag, so we need to close it
    // if this is a server render
    if (isServer) {
      element = element + ">";
    }

    // anything that goes between the tags
    // only happens on elements that have
    // opening and closing tags
    const singletonTags = [
      "area",
      "base",
      "br",
      "col",
      "command",
      "embed",
      "hr",
      "img",
      "input",
      "keygen",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ];

    if (!singletonTags.includes(tagName)) {
      // now go through the rest of the properties,
      // in order of importance
      for (var key in obj) {
        const value = obj[key];

        if (value !== null) {
          if (
            key === "children" ||
            key === "child" ||
            key === "prepend" ||
            key === "append" ||
            key === "textContent" ||
            key === "innerHTML"
          ) {
            if (key === "prepend") {
              // check if this is an object, otherwise we
              // just need to add it as textContent
              if (typeof value !== "object") {
                if (isServer) {
                  element = element + value;
                } else {
                  element.prepend(document.createTextNode(value));
                }
              } else {
                if (isServer) {
                  element = element + renderTemplate(value, isServer);
                } else {
                  const childElement = renderTemplate(value);
                  if (childElement !== null) {
                    element.prepend(childElement);
                  }
                }
              }
            } else if (key === "children" || key === "child") {
              let children = key === "children" ? value : [value];

              for (let i = 0; i < children.length; i++) {
                const child = children[i];

                if (isServer) {
                  // render the template for the child
                  element = element + renderTemplate(child, isServer);
                } else {
                  const childElement = renderTemplate(child);
                  if (childElement !== null) {
                    element.appendChild(childElement);
                  }
                }
              }
            } else if (key === "textContent") {
              if (isServer) {
                element = element + value;
              } else {
                element.appendChild(document.createTextNode(value));
              }
            } else if (key === "innerHTML") {
              if (isServer) {
                element = element + value;
              } else {
                element[key] = value;
              }
            } else if (key === "append") {
              // check if this is an object, otherwise we
              // just need to add it as textContent
              if (typeof value !== "object") {
                if (isServer) {
                  element = element + value;
                } else {
                  element.appendChild(document.createTextNode(value));
                }
              } else {
                if (isServer) {
                  element = element + renderTemplate(value, isServer);
                } else {
                  element.appendChild(renderTemplate(value, isServer));
                }
              }
            }
          }
        }
      }

      // and if this is a server render, we need to close the tag
      if (isServer) {
        element = element + "</" + tagName + ">";
      }
    }
  }

  return element;
};

export class TABLE {
  constructor(thead, tbody) {
    this.tagName = "table";
    this.childen = [
      {
        tagName: "thead",
        child: {
          tagName: "tr",
          children: thead,
        },
      },
      {
        tagName: "tbody",
        children: tbody,
      },
    ];
  }
}
