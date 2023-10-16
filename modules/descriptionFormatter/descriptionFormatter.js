// export const descriptionFormatter = (description) => {
//   const formattedDescription = description
//     .split("Support")[0]
//     .split("CREDITS:")[0]
//     .split("See Privacy Policy")[0]
//     .split("See omnystudio.com")[0]
//     .split("Music / Sound Effects")[0]
//     .split("Music/Sound Effects")[0]
//     .split("Music includes")[0]
//     .split("Music credits")[0]
//     .split("Music Credits:")[0]
//     .split("Time Codes:")[0]
//     .split("Get tickets")[0]
//     .split("THIS WEEK")[0]
//     .split("CREDITS")[0]
//     .split("Production and Editing")[0]
//     .split("Subscribe")[0]
//     .split("Check out")[0]
//     .split("Get Tickets")[0]
//     .split("Get tickets")[0]
//     .split("Follow ")[0]
//     .split("For even more")[0]
//     .split("Dungeon Court Theme Song")[0]
//     .replaceAll("<p>", " ")
//     .replaceAll("</p>", " ")
//     .trim();

//   return formattedDescription;
// };

import { stripHtml } from "../formatString/formatString.js";

export const descriptionFormatter = (rawDescription) => {
  if (
    rawDescription === undefined ||
    rawDescription === null ||
    rawDescription === ""
  ) {
    return rawDescription;
  } else {
    const textDescription = stripHtml(rawDescription);

    let formattedString = "";

    const adStrings = [
      "support the show",
      "credits:",
      "music / sound effects",
      "music/sound effects",
      "music:",
      "music includes",
      "music credits",
      "time codes",
      "get tickets",
      "production and editing",
      "subscribe",
      "dungeon court theme song",
      "https://",
      "www.",
      ".com",
      "use code",
      "promo code",
      "download",
      "vpn",
      "netflix",
      "now streaming",
      `" by`,
      "” by",
      "privacy policy",
      "buy tickets",
      "livestream",
    ];

    // split the rawDescription into an array of strings
    // using the delimisters . , ! ? and \n
    const splitDescription = textDescription.split(/(\. |\!|\?|\n)/),
      delimiters = [". ", "!", "?"];

    // loop through the array of strings, and if
    // the string contains an adString, don't add it
    // to the formattedString

    //console.log(splitDescription);

    splitDescription.forEach((string, index) => {
      const previousString = splitDescription[index - 1];

      const containsAdString = (str) => {
        return adStrings.some((adString) =>
          str.toLowerCase().includes(adString)
        );
      };

      // console.log(`Checking string: "${string}"`);
      // console.log(containsAdString(string));
      if (!containsAdString(string)) {
        // console.log(`"${string}" doesn't contain an ad string`);
        // check to see if this string is a delimiter
        if (delimiters.includes(string)) {
          // console.log(`"${string}" is a delimiter`);
          // if it is, check to see if the previous string isn't a delimiter
          // before adding it to the formatted string
          //console.log(`Checking previous string: "${previousString}"`);
          if (
            !delimiters.includes(previousString) &&
            !containsAdString(previousString)
          ) {
            // console.log(
            //   `"${previousString}" isn't a delimiter or an adString, so adding "${string}" to formattedString`
            // );

            formattedString += string;
          }
          // else {
          //   console.log(
          //     `"${previousString}" is a delimiter or an adString, so skipping "${string}"`
          //   );
          // }
        } else {
          // console.log(
          //   `"${string}" isn't a delimiter, so adding it to formattedString`
          // );
          // if not, add it to the formattedString
          formattedString += string;
        }
      }
      // else {
      //   console.log(
      //     `"${string}" contains an ad string, so it is being skipped`
      //   );
      // }
    });

    return formattedString.trim(); // remove any unneccssary spaces
  }
};
