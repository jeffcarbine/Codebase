/** Format Currency
 *  Formats numbers into curency strings with dollar signs and two decimal places
 *
 *  50 => $50.00
 *  10.2 => $10.20
 */
export const formatCurrency = (input, currency = "USD") => {
  // uses Intl.NumberFormat and removes any characters before the currency symbol
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  let formatted = formatter.format(input);

  // Remove characters before any currency symbol
  formatted = formatted.replace(
    /.*(?=[\$€£¥₹₽₺₩₪₫₦₲₴₵₸₿฿₡₣₤₥₧₨₩₪₫₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿])/,
    ""
  );

  return formatted;
};

/** Format Cents
 *  Formats cents into dollars with dollar signs and two decimal places
 *
 *  500 => $5.00
 *  10322 =>  $103.22
 */
export const formatCents = (input = 0, currency = "USD") => {
  let i;

  // divide by 100 if we're greater than zero
  if (input > 0) {
    i = input / 100;
  } else {
    // otherwise, you've just got a zero
    i = input;
  }

  // and then just run the regular formatter
  return formatCurrency(i, currency);
};
