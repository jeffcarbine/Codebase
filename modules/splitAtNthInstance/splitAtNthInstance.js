export const splitAtNthInstance = (str, char, n) => {
  const tokens = str.split(char).slice(n),
    result = char + tokens.join(char);

  return [str.replace(result, ""), result];
};
