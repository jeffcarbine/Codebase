/**
 * DataEmit
 * @module dataEmit
 * @description emits data to elements
 * @param {string} key the key to emit to
 * @param {string} value the value to emit
 */

export const dataEmit = (key, value) => {
  // get all elements with a data-emit attribute
  const elements = document.querySelectorAll("[data-emit]");

  // loop through the elements
  elements.forEach((element) => {
    // check if we are bound to this key
    if (element.dataset.emit === key) {
      const gt = element.dataset.emitGt,
        lt = element.dataset.emitLt,
        eq = element.dataset.emitEq,
        neq = element.dataset.emitNeq,
        gte = element.dataset.emitGte,
        lte = element.dataset.emitLte;

      const conditions = {};

      if (gt !== undefined) conditions.gt = gt;
      if (lt !== undefined) conditions.lt = lt;
      if (eq !== undefined) conditions.eq = eq;
      if (neq !== undefined) conditions.neq = neq;
      if (gte !== undefined) conditions.gte = gte;
      if (lte !== undefined) conditions.lte = lte;

      // default conditionsMet to true
      let conditionsMet = true;

      // check if this is a simple condition or a complex condition
      if (Object.keys(conditions).length === 0) {
        // if it is a simple condition, check if the value is truthy
        if (value !== false && value !== undefined && value !== null) {
          conditionsMet = true;
        } else {
          conditionsMet = false;
        }
      } else {
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
      }

      // get the value we are emiting to
      const emitTo = element.dataset.emitTo,
        emitValue = element.dataset.emitValue;

      // if the conditions are met
      if (conditionsMet) {
        // set the data-bound attribute to true
        element.dataset.bound = true;

        // if there is a emitValue, use that
        if (emitTo !== undefined) {
          // get the original value of the attribute
          const attributeValue = element.getAttribute(emitTo) || "";
          let newValue = emitValue !== undefined ? emitValue : value,
            newAttributeValue = !attributeValue.includes(newValue)
              ? `${attributeValue} ${newValue}`
              : attributeValue;

          element.setAttribute(emitTo, newAttributeValue);
        } else {
          // otherwise use the textcontent
          // if there is a emitValue, use that
          if (emitValue !== undefined) {
            element.textContent = emitValue;
          } else {
            // otherwise use the value
            element.textContent = value;
          }
        }
      } else {
        // otherwise, remove the data-bound attribute
        delete element.dataset.bound;

        if (emitTo !== undefined) {
          // remove the bound value from the attribute
          const attributeValue = element.getAttribute(emitTo) || "";
          let newValue = emitValue !== undefined ? emitValue : value,
            newAttributeValue = attributeValue.replace(newValue, "").trim();

          element.setAttribute(emitTo, newAttributeValue);
        }
      }
    }
  });
};
