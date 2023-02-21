import months from "../months/_months.js";

export const formatDate = (date) => {
  const dayMonth = formatDayMonth(date),
    year = date.getFullYear();

  return dayMonth + " " + year;
};

export const formatDayMonth = (date) => {
  const dayNumber = date.getDate(),
    month = months[date.getMonth()];

  let suffix = "th";

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

  return month + " " + dayNumber + suffix;
};
