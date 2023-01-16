export const formatCurrency = (input) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(input);
};

export const formatCents = (input = 0) => {
  let dollars;

  if (input > 0) {
    dollars = input / 100;
  } else {
    dollars = input;
  }

  return formatCurrency(dollars);
};
