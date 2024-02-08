export const numOnly = (str) => {
  // return only the numbers and parse as a number
  return parseInt(str.replace(/\D/g, ""));
};

export const lowerAlphaNumOnly = (str) => {
  const formattedStr = str.replace(/\W/g, "").toLowerCase();

  return formattedStr;
};

export const alphaNum = (str) => {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
};

export const lowerAlphaNum = (str) => {
  return alphaNum(str).toLowerCase();
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

export const capitalCase = (str) => {
  // from "example string" to "ExampleString"

  const arr = str.split(" ");

  for (var i = 0; i < arr.length; i++) {
    arr[i] = capitalize(arr[i]);
  }

  return arr.join("");
};

export const deCamelize = (str) => {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const camelize = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/[^A-Z0-9]+/gi, "");
};

export const hyphenate = (str) => {
  const trimmed = str.trim();
  return trimmed.replace(/[\W_]+/g, "-").toLowerCase();
};

export const urlHyphenate = (str) => {
  const alphaNum = lowerAlphaNum(str),
    urlHyphenated = hyphenate(alphaNum);

  return urlHyphenated;
};

export const camelToHyphen = (str) => {
  const deCamelized = deCamelize(str),
    hyphenated = hyphenate(deCamelized);

  return hyphenated;
};

export const htmlize = (str) => {
  const encodedStr = str.replace(
    /[\u00A0-\u9999<>\&]/g,
    (i) => "&#" + i.charCodeAt(0) + ";"
  );

  return encodedStr;
};

export const stripHtml = (str) => {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str
    .replace(/(<([^>]+)>)/gi, " ")
    .replaceAll("&nbsp;", " ")
    .trim();
};

export const urlProtocol = (str) => {
  // if the string doesn't have a http:// or https:// prefix, add it
  if (!str.includes("http")) {
    return `https://${str}`;
  }
};

let splitSentences = (str) => {
  // split sentences on . ! ? and \n but keep the delimiter
  // split on . ! ? and \n but keep the delimiter
  const split = str.split(/(\. |\!|\?|\n)/);
};
