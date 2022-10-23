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
  } else {
    element = document.createElement("div");
  }

  for (var key in obj) {
    if (
      key !== "children" &&
      key !== "child" &&
      key !== "tagName" &&
      key !== "textContent"
    ) {
      element.setAttribute(key, obj[key]);
    } else if (key === "textContent") {
      element.textContent = obj[key];
    } else if (key === "children") {
      let children = obj[key];

      for (var i = 0; i < children.length; i++) {
        let child = children[i];

        let childElement = createDynamicElement(child);
        element.appendChild(childElement);
      }
    } else if (key === "child") {
      let child = obj[key];

      let childElement = createDynamicElement(child);
      element.appendChild(childElement);
    }
  }

  return element;
};
