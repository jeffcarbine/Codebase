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

  return [startOfMonth, start_date];
};

export const fullMonth = (start_date = new Date()) => {
  let startOfMonth = new Date(start_date),
    endOfMonth = new Date(start_date);

  const month = start_date.getMonth();

  startOfMonth.setDate(1);
  endOfMonth.setMonth(month + 1);
  endOfMonth.setDate(0);

  return [startOfMonth, endOfMonth];
};

export const weekRange = (offsetWeeks = 0, date = new Date()) => {
  const week_comparison = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + offsetWeeks * 7
  );

  let start_date = new Date(),
    end_date = new Date();

  start_date.setDate(week_comparison.getDate() - week_comparison.getDay());
  start_date.setHours(0, 0, 0, 0);
  end_date.setDate(start_date.getDate() + 7);
  end_date.setHours(23, 59, 59, 999);

  return {
    start_date,
    end_date,
  };
};
