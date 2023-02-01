export const renderTemplate = (obj, isServer = false) => {
  console.log("attempting to render!");
  // start by creating the element
  let element;

  // if this is the server, we need to output a string,
  // otherwise we'll use the document.createElement for
  // the frontend
  if (isServer) {
    element = "<";
  }

  // if there is a tagname
  if (obj.tagName !== undefined) {
    if (isServer) {
      // pass that as the first part of the html string
      element += obj.tagName;
    } else {
      // create that element
      element = document.createElement(obj.tagName);
    }
    // if it is not an icon, we default to div
  } else if (!obj.icon) {
    if (isServer) {
      element += "div";
    } else {
      element = document.createElement("div");
    }
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
            element += " " + key + "='" + value + "'";
          } else {
            element.setAttribute(key, value);
          }
        }
      }
    }

    // // go through every key/value pair that isn't
    // // an html property
    // for (let key in obj) {
    //   if (key === "if") {
    //     // then this is conditional on the if value being true
    //     const isTrue = value;

    //     // if not true, return a null value
    //     if (!isTrue) {
    //       return null;
    //     }
    //   } else if (key === "textContent") {
    //     if (isServer) {
    //     } else {
    //       element.textContent = value;
    //     }
    //   } else if (key === "prepend" || key === "append" || key === "children") {
    //     let children = value;

    //     for (var i = 0; i < children.length; i++) {
    //       let child = children[i];

    //       let childElement = createDynamicElement(child);

    //       if (key === "children" || key === "append") {
    //         if (childElement !== null) {
    //           element.appendChild(childElement);
    //         }
    //       } else if (key === "prepend") {
    //         if (childElement !== null) {
    //           element.prepend(childElement);
    //         }
    //       }
    //     }
    //   } else if (key === "child") {
    //     let child = value;

    //     let childElement = createDynamicElement(child);
    //     if (childElement !== null) {
    //       element.appendChild(childElement);
    //     }
    //   } else if (key === "innerHTML") {
    //     element.innerHTML = value;
    //   }
    // }
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
