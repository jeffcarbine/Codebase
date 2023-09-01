export const generateUniqueId = (length = 6) => {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substring(2, length + 2)
  );
};
