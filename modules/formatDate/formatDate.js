/** Format Date
 *  Takes a date object and returns a Month Day, Year format (January 5th, 2024 for example)
 */
// import our months array
import { months } from "../months/months.js";

export const formatDate = (date) => {
  console.log(date);
  // get the month name and appropriate suffix for the day
  const dayMonth = formatDayMonth(date),
    // pull the full year from the object itself
    year = date.getFullYear();

  // add it together
  return dayMonth + " " + year;
};

/** Format Day/Month
 *  Takes in a Date object and returns the month name and the day with the correct suffix
 */
export const formatDayMonth = (date) => {
  // get the day of the month
  const dayNumber = date.getDate(),
    // get the name of the month from the months array
    month = months[date.getMonth()];

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
  return month + " " + dayNumber + suffix;
};
