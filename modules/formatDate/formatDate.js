/** Format Date
 *  Takes a date object and returns a Month Day, Year format (January 5th, 2024 for example)
 */
// import our months array
import { months } from "../months/months.js";

export const formatDate = (date) => {
  // get the day, month and year values from the date object
  const day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear();

  // create the date string
  return createDateString(day, month, year);
};

export const createDateString = (day, month, year) => {
  const dayMonth = formatDayMonth(day, month);

  // add it together
  return dayMonth + " " + year;
};

/** Format Day/Month
 *  Takes in a Date object and returns the month name and the day with the correct suffix
 */
export const formatDayMonth = (day, month) => {
  // get the day of the month
  const dayNumber = parseInt(day),
    // get the name of the month from the months array
    monthName = months[parseInt(month) - 1];

  // default suffix is th
  let suffix = "th";

  // switch through the other options
  switch (dayNumber) {
    case 1:
    case 21:
    case 31:
      suffix = "st";
      break;
    case 2:
    case 22:
      suffix = "nd";
      break;
    case 3:
    case 23:
      suffix = "rd";
      break;
  }

  // add it together
  return monthName + " " + dayNumber + suffix;
};

export const formatSimpleDate = (simpledate) => {
  // convert YYYYMMDD number to YYYY-MM-DD string
  const year = simpledate.toString().slice(0, 4),
    month = simpledate.toString().slice(4, 6),
    day = simpledate.toString().slice(6, 8);

  return createDateString(day, month, year);
};
