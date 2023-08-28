/**
 * DataBind
 * @module dataBind
 * @description binds data to elements
 * @param {string} key the key to bind to
 * @param {string} value the value to bind
 */

export const dataBind = (key, value) => {
  // get all elements with a data-bind attribute
  const elements = document.querySelectorAll("[data-bind]");

  // loop through the elements
  elements.forEach((element) => {
    // check if we are bound to this key
    if (element.dataset.bind === key) {
      const gt = element.dataset.bindGt,
        lt = element.dataset.bindLt,
        eq = element.dataset.bindEq,
        neq = element.dataset.bindNeq,
        gte = element.dataset.bindGte,
        lte = element.dataset.bindLte,
        conditions = { gt, lt, eq, neq, gte, lte };

      // default conditionsMet to true
      let conditionsMet = true;

      // loop through the conditions
      for (const condition in conditions) {
        // get the condition value
        const conditionValue = conditions[condition];

        // if the condition exists
        if (conditionValue !== undefined) {
          // check for greater than condition
          if (condition === "gt") {
            // if the value is greater than the condition value
            if (value > conditionValue) {
              continue;
            } else {
              // otherwise, the conditions are not met
              conditionsMet = false;
              break;
            }
            // check for less than condition
          } else if (condition === "lt") {
            // if the value is less than the condition value
            if (value < conditionValue) {
              continue;
            } else {
              // otherwise, the conditions are not met
              conditionsMet = false;
              break;
            }
            // check for equal to condition
          } else if (condition === "eq") {
            // if the value is equal to the condition value
            if (value === conditionValue) {
              continue;
            } else {
              // otherwise, the conditions are not met
              conditionsMet = false;
              break;
            }
            // check for not equal to condition
          } else if (condition === "neq") {
            // if the value is not equal to the condition value
            if (value !== conditionValue) {
              continue;
            } else {
              // otherwise, the conditions are not met
              conditionsMet = false;
              break;
            }
            // check for greater than or equal to condition
          } else if (condition === "gte") {
            // if the value is greater than or equal to the condition value
            if (value >= conditionValue) {
              continue;
            } else {
              // otherwise, the conditions are not met
              conditionsMet = false;
              break;
            }
            // check for less than or equal to condition
          } else if (condition === "lte") {
            // if the value is less than or equal to the condition value
            if (value <= conditionValue) {
              continue;
            } else {
              // otherwise, the conditions are not met
              conditionsMet = false;
              break;
            }
          }
        }
      }

      // if the conditions are met
      if (conditionsMet) {
        // set the data-bound attribute to true
        element.dataset.bound = true;

        // get the value we are binding to
        const bindTo = element.dataset.bindTo,
          bindValue = element.dataset.bindValue;

        // if there is a bindValue, use that
        if (bindTo !== undefined) {
          // if there is a bindValue, use that
          if (bindValue !== undefined) {
            element.setAttribute(bindTo, bindValue);
          } else {
            // otherwise use the value
            element.setAttribute(bindTo, value);
          }
        } else {
          // otherwise use the textcontent
          // if there is a bindValue, use that
          if (bindValue !== undefined) {
            element.textContent = bindValue;
          } else {
            // otherwise use the value
            element.textContent = value;
          }
        }
      } else {
        // otherwise, remove the data-bound attribute
        delete element.dataset.bound;
      }
    }
  });
};
