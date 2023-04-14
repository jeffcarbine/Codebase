/** Format Currency
 *  Formats numbers into curency strings with dollar signs and two decimal places
 *
 *  50 => $50.00
 *  10.2 => $10.20
 */
export const formatCurrency = (input) => {
  // uses Intl.NumberFormat as intended
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(input);
};

/** Format Cents
 *  Formats cents into dollars with dollar signs and two decimal places
 *
 *  500 => $5.00
 *  10322 =>  $103.22
 */
export const formatCents = (input = 0) => {
  let dollars;

  // divide by 100 if we're greater than zero
  if (input > 0) {
    dollars = input / 100;
  } else {
    // otherwise, you've just got a zero
    dollars = input;
  }

  // and then just run the regular formatter
  return formatCurrency(dollars);
};
