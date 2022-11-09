import iconList from "../../components/icon/_icon-list.js";

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
    const iconName = obj.icon,
      iconString = iconList[iconName],
      markup =
        "<svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 320.27 316.32'>" +
        iconString.replace(/cls/g, iconName) +
        "</svg>";

    element = new DOMParser().parseFromString(markup, "text/xml").firstChild;

    element.classList.add("icon-" + obj.icon);
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
