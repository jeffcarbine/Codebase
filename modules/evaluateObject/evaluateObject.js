export const evaluateObject = (obj, keys) => {
  console.log("evaluating object");

  // split the keys into individual keys
  const keyList = keys.split(".");

  console.log(keyList);

  let value = obj;

  const checkProperty = (property, index) => {
    console.log(property);
    console.log(value);

    if (obj[property] !== undefined) {
      console.log(`${property} is not undefined`);
      console.log(`the index is ${index}`);
      if (index === keyList.length - 1) {
        return value;
      } else {
        value = value[property];
        const i = index + 1;
        return checkProperty(keyList[i], i);
      }
    } else {
      return false;
    }
  };

  return checkProperty(keyList[0], 0);
};
