import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { xhrForm } from "../../modules/xhr/xhr.js";

// global variables
let csvData, skuList, productNames, memberData;

const cuts = ["U", "L"],
  sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"],
  headers = {
    name: "Name",
    command: "Command",
    note: "Note",
    tags: "Tags",
    sendInvoice: "Send Invoice",
    sendInvoiceTo: "Send Invoice: To",
    sendInvoiceFrom: "Send Invoice From",
    customerEmail: "Customer: Email",
    customerPhone: "Customer: Phone",
    customerFirstName: "Customer: First Name",
    customerLastName: "Customer: Last Name",
    shippingFirstName: "Shipping: First Name",
    shippingLastName: "Shipping: Last Name",
    shippingPhone: "Shipping: Phone",
    shippingAddress1: "Shipping: Address 1",
    shippingAddress2: "Shipping: Address 2",
    shippingZip: "Shipping: Zip",
    shippingCity: "Shipping: City",
    shippingProvinceCode: "Shipping: Province Code",
    shippingCountryCode: "Shipping: Country Code",
    row: "Row #",
    topRow: "Top Row",
    lineType: "Line: Type",
    lineTitle: "Line: Title",
    lineName: "Line: Name",
    lineSku: "Line: SKU",
    lineQuantity: "Line: Quantity",
    linePrice: "Line: Price",
    lineDiscount: "Line: Discount",
    lineRequiresShipping: "Line: Requires Shipping",
  };

function csvToArray(str, delimiter = ",") {
  // slice from start of text to the first \n index
  // use split to create an array from string by delimiter
  const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

  // slice from \n index + 1 to the end of the text
  // use split to create an array of each csv value row
  const rows = str.slice(str.indexOf("\n") + 1).split("\n");

  // Map the rows
  // split values from each row into an array
  // use headers.reduce to create an object
  // object properties derived from headers:values
  // the object passed as an element of the array
  const arr = rows.map(function (row) {
    const values = row.split(delimiter);
    const el = headers.reduce(function (object, header, index) {
      object[header] = values[index];
      return object;
    }, {});
    return el;
  });

  // return the array
  return arr;
}

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON
  var jsonObject = JSON.stringify(items);

  var csv = convertToCSV(jsonObject);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function pad(num, size) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

///

const generateMerchClubCSV = (members, body) => {
  const skus = body.skuList.split(","),
    names = body.productNames.split(","),
    quarter = body.quarter,
    year = body.year;

  let newCSV = [];

  // now generate the new JSON
  members.forEach((member, index) => {
    const personName = member.address.addressee;

    let note =
      "Your latest Merch Club rewards are ready! Complete this order if you need to update your address or if you want to get your items a little early. Otherwise your items will process in 48 hours!";

    // now, we need to loop over the SKUs and generate them
    for (var e = 0; e < skus.length; e++) {
      let sku = skus[e],
        productName = names[e];

      if (sku.indexOf("*") > -1) {
        // then we need to replace the asterisk with the appropriate size/cut
        // but in order to do that, we need entry.server - so, if that is blank,
        // then we skip this SKU
        if (member.shirtCut === undefined || member.shirtSize === undefined) {
          note +=
            " But it looks like we couldn't find your shirt size in our system - sorry about that! Reach out to us at contact@naddpod.com and we'll help you get your missing merch!";
          continue;
        } else {
          sku = sku.replace(
            "*",
            cuts[member.shirtCut] + sizes[member.shirtSize]
          );
        }
      }

      const mergedEntry = {
        name: "MC" + quarter + year + "-" + pad(index, 4),
        command: "NEW",
        note: note,
        tags: "merch club",
        sendInvoice: "TRUE",
        sendInvoiceTo: member.email,
        sendInvoiceFrom: "",
        customerEmail: member.email,
        customerPhone: member.phone,
        customerFirsName: personName.split(" ")[0] || " ",
        customerLastName: personName.split(" ")[1] || " ",
        shippingFirstName: personName.split(" ")[0] || " ",
        shippingLastName: personName.split(" ")[1] || " ",
        shippingPhone: member.phone,
        shippingAddress1: member.address.line_1.replace(/,/g, "") || " ",
        shippingAddress2:
          member.address.line_2 === null
            ? ""
            : member.address.line_2.replace(/,/g, "") || " ",
        shippingZip: member.address.postal_code || " ",
        shippingCity: member.address.City || " ",
        shippingProvinceCode: member.address.state || " ",
        shippingCountryCode: member.address.country || " ",
        row: e + 1,
        topRow: "TRUE",
        lineType: "Line Item",
        lineTitle: productName,
        lineName: productName,
        lineSku: sku,
        lineQuantity: 1,
        linePrice: 0,
        lineDiscount: 1000,
        lineRequiresShipping: "TRUE",
      };

      newCSV.push(mergedEntry);
    }

    // and now, at the end, add shipping
    const shippingEntry = {
      name: "MC" + quarter + year + "-" + pad(index, 4),
      command: "NEW",
      note: note,
      tags: "merch club",
      sendInvoice: "TRUE",
      sendInvoiceTo: member.email,
      sendInvoiceFrom: "",
      customerEmail: member.email || " ",
      customerPhone: member.phone,
      customerFirsName: personName.split(" ")[0] || " ",
      customerLastName: personName.split(" ")[1] || " ",
      shippingFirstName: personName.split(" ")[0] || " ",
      shippingLastName: personName.split(" ")[1] || " ",
      shippingPhone: member.phone,
      shippingAddress1: member.address.line_1.replace(/,/g, "") || " ",
      shippingAddress2:
        member.address.line_2 === null
          ? ""
          : member.address.line_2.replace(/,/g, "") || " ",
      shippingZip: member.address.postal_code || " ",
      shippingCity: member.address.City || " ",
      shippingProvinceCode: member.address.state || " ",
      shippingCountryCode: member.address.country || " ",
      row: skus.length + 1,
      topRow: "TRUE",
      lineType: "Shipping Line",
      lineTitle: "Merch Club Free Shipping",
      lineName: "Merch Club Free Shipping",
      lineSku: " ",
      lineQuantity: " ",
      linePrice: 0,
      lineDiscount: " ",
      lineRequiresShipping: " ",
    };

    newCSV.push(shippingEntry);
  });

  exportCSVFile(headers, newCSV, "MC" + quarter + year + "-full-list");
};

const submitMerchClubCSVForm = (form) => {
  const success = (request, body) => {
    form.classList.remove("loading");
    const members = JSON.parse(request.response);

    generateMerchClubCSV(members, body);
  };

  xhrForm({ form, success });
};

addEventDelegate("submit", "#merchClubCSV", submitMerchClubCSVForm, true);
