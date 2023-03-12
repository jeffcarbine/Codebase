export const lowerAlphaNumOnly = (str) => {
  const formattedStr = str.replace(/\W/g, "").toLowerCase();

  return formattedStr;
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeAll = (str) => {
  const arr = str.split(" ");

  for (var i = 0; i < arr.length; i++) {
    arr[i] = capitalize(arr[i]);
  }

  return arr.join(" ");
};

export const deCamelize = (str) => {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};
