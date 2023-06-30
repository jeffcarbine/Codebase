import { camelToHyphen } from "../modules/formatString/formatString.js";

const clientRender = (template) => {
  if (template === null) {
    return null;
  }

  // start by creating the element
  let element;

  // check to see if the template has an "if" property, and check if it is true
  // or not - if not true, they we just don't render anything
  if (template.if !== undefined && !template.if) {
    // then check it if is false
    if (!template.if) {
      return null;
    }
  }

  // if this is just a string and not actually an object,
  // the we just need to return the text
  if (typeof template === "string") {
    element = document.createTextNode(template);
    return element;
  }

  // set the tagName
  let tagName = template.tagName !== undefined ? template.tagName : "div";

  // if the template does not have an icon value, create an
  // element with that tagName
  if (template.icon === undefined) {
    // create that element
    element = document.createElement(tagName);
  }

  if (template.icon) {
    // this is an icon, so we can ignore the rest
    const icon = template.icon;

    const markup =
      "<svg class='icon' xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 320.27 316.32'>" +
      icon +
      "</svg>";

    element = new DOMParser().parseFromString(markup, "text/xml").firstChild;
  } else {
    // go through every key/value pair that is
    // an html property
    for (var key in template) {
      const value = template[key];

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
        }
      }
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
      for (var key in template) {
        const value = template[key];

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
                element.prepend(document.createTextNode(value));
              } else {
                const childElement = clientRender(value);
                if (childElement !== null) {
                  element.prepend(childElement);
                }
              }
            } else if (key === "children" || key === "child") {
              let children = key === "children" ? value : [value];

              for (let i = 0; i < children.length; i++) {
                const child = children[i];

                const childElement = clientRender(child);
                if (childElement !== null) {
                  element.appendChild(childElement);
                }
              }
            } else if (key === "textContent") {
              element.appendChild(document.createTextNode(value));
            } else if (key === "innerHTML") {
              element[key] = value;
            } else if (key === "append") {
              // check if this is an object, otherwise we
              // just need to add it as textContent
              if (typeof value !== "object") {
                element.appendChild(document.createTextNode(value));
              } else {
                const childElement = clientRender(value);
                if (childElement !== null) {
                  element.appendChild(childElement);
                }
              }
            }
          }
        }
      }
    }
  }

  return element;
};

const serverRender = (template) => {
  if (template === null) {
    return null;
  }

  // start by creating the element
  let element;

  // check to see if the template has an "if" property, and check if it is true
  // or not - if not true, they we just don't render anything
  if (template.if !== undefined) {
    // then check it if is false
    if (!template.if) {
      return "";
    }
  }

  // if this is just a string and not actually an object,
  // the we just need to return the text
  if (typeof template === "string") {
    return template;
  }

  // if this is an HTML element, we need to add the doctype
  if (template.tagName == "html") {
    element = "<!DOCTYPE html><";
  } else {
    element = "<";
  }

  // set the tagName
  let tagName = "div";
  if (template.tagName !== undefined) {
    tagName = template.tagName;
  }

  if (template.icon === undefined) {
    // pass that as the first part of the html string
    element += tagName;
  }

  if (template.icon) {
    // this is an icon, so we can ignore the rest
    const icon = template.icon;

    // there should only be one key/value pair, but we
    // use a loop cause I don't know of a cleaner way to
    // do this
    const markup =
      "<svg class='icon' xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 320.27 316.32'>" +
      icon +
      "</svg>";

    element = markup;
  } else {
    // go through every key/value pair that is
    // an html property
    for (var key in template) {
      const value = template[key];

      // TODO: check here for link tags that are loading
      // a .css file - if they are, then we should load
      // the file using fs and then read the contents of
      // the style and inject it as inline css instead

      if (value !== null) {
        if (
          key !== "children" &&
          key !== "prepend" &&
          key !== "append" &&
          key !== "child" &&
          key !== "tagName" &&
          key !== "textContent" &&
          key !== "innerHTML" &&
          key !== "if" &&
          key !== "style"
        ) {
          // check if this is a link tag that has a src property
          if (tagName === "link" && template.src !== undefined) {
            // and now we can check for the .css
            if (template.src.includes(".css")) {
              // change this to a style tag
              tagName = "style";
              element = "<style>";

              // now load the contents of the file requested
              let cssContent;

              // and then inject it into the element
              element = element + cssContent;
            }
          }

          element = element + " " + key + "='" + value + "'";
        } else if (key === "style") {
          let style = "";
          // for styles, we can accept either a string or an object
          if (typeof value === "string") {
            style = value;
          } else if (typeof value === "object") {
            for (let key in value) {
              const property = camelToHyphen(key);
              style = style + property + ":" + value[key] + ";";
            }
          }

          element = element + " style='" + style + "'";
        }
      }
    }

    // now we've made it through the first tag, so we need to close it
    element = element + ">";

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
      for (var key in template) {
        const value = template[key];

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
                element = element + value;
              } else {
                element = element + serverRender(value);
              }
            } else if (key === "children" || key === "child") {
              let children = key === "children" ? value : [value];

              for (let i = 0; i < children.length; i++) {
                const child = children[i];
                // render the template for the child
                element = element + serverRender(child);
              }
            } else if (key === "textContent") {
              element = element + value;
            } else if (key === "innerHTML") {
              element = element + value;
            } else if (key === "append") {
              // check if this is an object, otherwise we
              // just need to add it as textContent
              if (typeof value !== "object") {
                element = element + value;
              } else {
                element = element + serverRender(value);
              }
            }
          }
        }
      }

      // and if this is a server render, we need to close the tag
      element = element + "</" + tagName + ">";
    }
  }

  return element;
};

export const renderTemplate = (template) => {
  const isServer = typeof document === "undefined";

  if (isServer) {
    return serverRender(template);
  } else {
    return clientRender(template);
  }
};
