/**
 * Icon Loader
 * This loads our SVG icons from data-icon elements
 * Icons are stored as string entries in the iconList or colorIconList objects
 * in the icon-list.js and color-icon-list.js files, respectively
 *
 * @example
 * To load an icon, you would add a data-icon or data-color-icon attribute to
 * the element you wish to receive an icon
 *      <i class="persistent-class" data-icon="sandwich"></i>
 *      <h2 class="class-isnt-passed" data-color-icon="accounts">
 *          Accounts
 *      </h2>
 *
 * If the element is an <i>, it will be replaced by the <svg>, but if not, then
 * the <svg> is just loaded as a child of the element and the element is given
 * a class of "has-icon".
 * Element classes are also assed on <i> elements, but not on others.
 *      <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 320.27 316.32" class="icon sandwich persistent-class">
 *          ...
 *      </svg>
 *      <h2 class="class-isnt-passed has-icon icon-accounts">
 *          Accounts
 *          <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 320.27 316.32" class="color-icon accounts">
 *              ...
 *          </svg>
 *      </h2>
 */

// bool to keep icons from loading over each other
let generatingIcons = false;

/**
 * Load Icon
 * This matches the target with the corresponding icon and loads
 * the SVG element.
 *
 * @note If the element loading the icon is an <i>, it is replaced
 * in its entirety by an <svg>, but in any other situation the element
 * is preserved and it just receives the <svg> as a child
 *
 * @param {Element} target The element we are loading the icon into
 */

function loadIcon(target) {
  // check to see if this is a color icon or not
  let isColor = target.dataset.colorIcon !== undefined ? true : false;

  // placeholder for the iconName
  var iconName;

  // get the icon name from the appropriate dataset
  if (!isColor) {
    iconName = target.dataset.icon;
  } else {
    iconName = target.dataset.colorIcon;
  }

  // only proceed if the iconName isn't blank
  if (iconName !== "") {
    // grab the classes of the target so we can add
    // it to the svg if the element is an <i>
    let iconClasses = target.classList;

    // blank placeholders for the string and markup
    var iconString;
    var iconMarkup;

    // get the icon from its corresponding object
    if (!isColor) {
      iconString = iconList[iconName];
    } else {
      iconString = colorIconList[iconName];
    }

    if (iconString !== undefined) {
      // this prevents icon's styles from bleeding over into other
      // icons - this is because of how Adobe exports SVGs
      iconMarkup =
        "<svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 320.27 316.32'>" +
        iconString.replace(/cls/g, iconName) +
        "</svg>";

      // now convert that markup into an element object
      let icon = new DOMParser().parseFromString(
        iconMarkup,
        "text/xml"
      ).firstChild;

      // set the appropriate class for the svg whether it is
      // color or not
      if (isColor) {
        icon.setAttribute("class", "color-icon");
      } else {
        icon.setAttribute("class", "icon");
      }

      icon.classList += iconName;

      // check to see if the element is an <i>, in which
      // case we replace it with our svg
      if (target.tagName === "I") {
        // give the icon the iconClasses
        icon.className += iconClasses;
        let parent = target.parentNode;
        // append the icon before the target
        parent.appendChild(icon, target);
        // remove the target
        target.remove();
      } else {
        // All of this code is if we are listening to
        // attribute mutations, which we are currently
        // not because of how buggy it is. But I'm leaving
        // this here so we can easily restore this once we
        // figure out attribute mutations
        //
        // first, check to see if there is
        // already an svg icon in the target
        // -- if so, this is a modification
        // of an existing data-icon attribute
        // and we need to remove the existing
        // svg in order to add the new one
        let existingIcon = Array.prototype.filter.call(
          target.children,
          function (node) {
            return node.matches("svg.icon");
          }
        );

        let hasSvg = existingIcon[0] !== undefined ? true : false;

        if (hasSvg) {
          existingIcon[0].remove();
        }

        // append the icon to the target
        target.appendChild(icon);
      }

      // and once we are done, remove the dataset
      delete target.dataset.icon;

      // and add a reference
      target.classList.add("has-icon");
      target.classList.add("icon-" + iconName);
    } else {
      console.warn(
        iconName +
          " is not a valid icon name. Please check the Codebase icon list and verify your spelling is correct."
      );
      // TODO
      // fuzzy search for "did you mean...?"
    }
  }
}

/**
 * Generate Icons
 * This reads the [data-icon] and [data-color-icon] elements on the page and
 * loads icons accordingly
 */

function generateIcons() {
  // if we aren't currently generating icons
  if (!generatingIcons) {
    // get all the icon placeholders
    let placeholders = document.querySelectorAll(
      "[data-icon], [data-color-icon]"
    );

    if (placeholders.length > 0) {
      // set generatingIcons to true
      generatingIcons = true;

      // loop through the placeholders
      placeholders.forEach(function (placeholder, i) {
        loadIcon(placeholder);

        // if we've reached the end of the loop, turn
        // generatingIcons back to false
        if (i === placeholders.length) {
          generatingIcons = false;
        }
      });
    }
  }
}

// run on mutation
addEventDelegate(
  "childList, attributes:data-icon",
  "[data-icon], [data-color-icon]",
  loadIcon
);

// run on load
addEventDelegate("load", window, generateIcons);
