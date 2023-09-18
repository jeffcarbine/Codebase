/** Date Ranges
 *  These functions allow you to simply create date ranges represented by
 *  two Date objects in an array
 *
 *  [start_date, end_date]
 */

/** Offset Date
 *  Gives you a date range of today and a second date
 *  as far into the future as you want, controlled by
 *  setting the year, month and day modification you want
 *  -- numbers can be positive or negative!
 */
export const offsetDate = (year = 0, month = 0, day = 0) => {
  // get today
  let first_date = new Date();
  // set the time to midnight
  first_date.setHours(0, 0, 0, 0);

  // get the year, month and day of first_date
  const first_year = first_date.getFullYear(),
    first_month = first_date.getMonth(),
    first_day = first_date.getDate();

  // get the end date
  let second_date = new Date();
  // set the time to midnight
  second_date.setHours(0, 0, 0, 0);

  // add the values you want to the second date
  second_date.setFullYear(first_year + year);
  second_date.setMonth(first_month + month);
  second_date.setDate(first_day + day);

  // make sure the smaller of the two days goes first
  if (first_date > second_date) {
    return [second_date, first_date];
  } else {
    return [first_date, second_date];
  }
};

/** Month-to-Date
 * Ges you a range from the start of the month to the
 * date you want, defaulting to today
 */
export const monthToDate = (start_date = new Date()) => {
  // create the Date object for the start of the month
  let startOfMonth = new Date(start_date);
  // set the date of that Date to 1
  startOfMonth.setDate(1);

  return [startOfMonth, start_date];
};

/** Full Month
 * Gets you a date range for the entire month a date is in,
 * defaulting to today
 */
export const fullMonth = (start_date = new Date()) => {
  // create date objects based off of the supplied date
  let startOfMonth = new Date(start_date),
    endOfMonth = new Date(start_date);

  // get the current month
  const month = start_date.getMonth();

  // start of month gets set to 1
  startOfMonth.setDate(1);

  // end of month gets set to next month
  endOfMonth.setMonth(month + 1);
  // and the day gets set to zero, flipping
  // the calendar back one day back to the end
  // of the previous month
  endOfMonth.setDate(0);

  return [startOfMonth, endOfMonth];
};

/** Week Range
 * I don't remember what this is for exactly, but I'll come back to this
 * once I get back into the project that required it
 */
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

export const numberOfMonths = (d1, d2) => {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
};
