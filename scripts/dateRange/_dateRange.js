export const offsetDate = (year = 0, month = 0, day = 0) => {
  let first_date = new Date();
  first_date.setHours(0, 0, 0, 0);

  const first_year = first_date.getFullYear(),
    first_month = first_date.getMonth(),
    first_day = first_date.getDate();

  // get the end date
  let second_date = new Date();
  second_date.setHours(0, 0, 0, 0);

  if (year !== 0) {
    second_date.setFullYear(first_year + year);
  }

  if (month !== 0) {
    second_date.setMonth(first_month + month);
  }

  if (day !== 0) {
    second_date.setDate(first_day + day);
  }

  if (first_date > second_date) {
    return [second_date, first_date];
  } else {
    return [first_date, second_date];
  }
};

export const monthToDate = (start_date = new Date()) => {
  let startOfMonth = new Date(start_date);
  startOfMonth.setDate(1);

  console.log(start_date, startOfMonth);

  return [startOfMonth, start_date];
};
