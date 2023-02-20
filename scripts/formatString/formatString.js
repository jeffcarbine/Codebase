export const lowerAlphaNumOnly = (str) => {
  const formattedStr = str.replace(/\W/g, "").toLowerCase();

  return formattedStr;
};
