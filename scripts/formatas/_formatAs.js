function formatAs(format, input) {
  var result;
  var str;

  switch (format) {
    case "currency":
      str = input;

      result = "$" + str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      break;

    case "currencyDecimals":
      if (typeof input === "number") {
        str = input.toFixed(2).toString();
      } else {
        str = input;
      }

      result = "$" + str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return result;
}
