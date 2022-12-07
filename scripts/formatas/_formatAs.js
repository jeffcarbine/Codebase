export const formatAsCurrency = (input, decimals = true) => {
  if (decimals) {
    let str;

    if (typeof input === "number") {
      str = input.toFixed(2).toString();
    } else {
      str = parseFloat(input).toFixed(2).toString();
    }

    return "$" + str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "$" + input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};
