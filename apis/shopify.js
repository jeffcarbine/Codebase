import * as dotenv from "dotenv";
dotenv.config();

// SHOPIFY
import Client from "shopify-buy";
import fetch from "node-fetch";
global.fetch = fetch;

const shopifyToken = process.env.SHOPIFYTOKEN,
  shopifyDomain = process.env.SHOPIFYDOMAIN;

export const shopify = Client.buildClient({
  storefrontAccessToken: shopifyToken,
  domain: shopifyDomain,
});

export const shopPromise = shopify.shop.fetchInfo();
export const productsPromise = shopify.product.fetchAll();

export const getCart = (req, res) => {
  let checkoutId = req.cookies["checkoutId"];

  // when a checkout is completed, it doesn't automatically clear
  // it from your cookies, so we need to check at time of retrieval
  // whether or not this checkout has been completed or not
  const verifyCheckout = (checkoutId) => {
    return shopify.checkout.fetch(checkoutId).then((checkout) => {
      // check to see if the checkout has already been completed
      if (checkout.completedAt !== null) {
        // then let's clear the checkoutId cookie
        req.cookies["checkoutId"] = null;
        // and re-fetch the cart
        fetch_cart(req, res);
      } else {
        // otherwise, we're good and can send the checkout
        return res.status(200).send(checkout);
      }
    });
  };

  // if we don't have a checkoutId, generate one
  if (!checkoutId) {
    // generate it
    checkoutId = shopify.checkout.create().then((checkout) => {
      res.cookie("checkoutId", checkout.id);

      // for good measure, let's send it through our verifyCheckout function
      return verifyCheckout(checkout.id);
    });
  } else {
    // otherwise, we have a checkoutId and just need to verify that the
    // checkpout is still valid
    return verifyCheckout(checkoutId);
  }
};

export const formatProduct = (product) => {
  // first, we need to structure the object
  let formattedProduct = {
      name: product.title,
      availableForSale: product.availableForSale,
      description: product.descriptionHtml,
      price: null,
      compareAtPrice: null,
      values: [],
      id: product.id,
      images: product.images,
      tags: product.tags,
      type: product.productType,
    },
    organizedOptions = [];

  // put the options into a new array that we can sort
  for (let i = 0; i < product.options.length; i++) {
    let option = product.options[i];
    organizedOptions.push(option);
  }

  // now, sort the options from smallest amount to largets amount
  // id: size (unisex, ladies), color (green, red, blue), size (XS, S, M, L, XL, 2XL, 3XL 4XL)
  organizedOptions.sort((a, b) => {
    return a.values.length - b.values.length;
  });

  // handles nesting each option
  const processOption = (option, obj, arr, finalLoop) => {
    // depending on the structure of the formattedProduct,
    // we process the option's data differently

    // if there is nothing in the variants yet, we
    // need to create the top level variant
    if (obj.values.length === 0) {
      // we need to loop through the option's values
      // and create new value objects for each one
      for (let i = 0; i < option.values.length; i++) {
        // create the new value object
        let value = {
          name: option.values[i].value,
        };

        // if this is not the final loop, then the value
        // needs its own values array
        if (!finalLoop) {
          value.values = [];
        } else {
          // behave differently if arr is null
          let newArr;
          if (arr === null) {
            newArr = [];
          } else {
            newArr = arr.slice();
          }

          newArr.push(value.name);

          for (var x = 0; x < product.variants.length; x++) {
            const variant = product.variants[x],
              title = variant.title;

            // make the title into an array
            const titleArr = title.split(" / ");

            // and check if the two arrays are the same
            const isMatch =
              newArr.sort().join(",") === titleArr.sort().join(",");

            if (isMatch) {
              // then we need to update this object with ids
              // and availbility or sold-out-ness
              value.id = variant.id;
              value.available = variant.available;
              value.price = variant.price;
              value.compareAtPrice = variant.compareAtPrice;
              value.imageid =
                "imageid" +
                variant.image.id.substring(
                  variant.image.id.lastIndexOf("/") + 1
                );

              if (formattedProduct.price === null) {
                formattedProduct.price = variant.price;
              }

              if (formattedProduct.compareAtPrice === null) {
                formattedProduct.compareAtPrice = variant.compareAtPrice;
              }

              break;
            }
          }
        }

        if (finalLoop) {
          if (value.id !== undefined) {
            obj.values.push(value);
          }
        } else {
          obj.values.push(value);
        }
      }
    } else {
      // then we need to dive deeper into the option
      for (let i = 0; i < obj.values.length; i++) {
        let entry = obj.values[i];
        let passedArr;

        if (arr === null) {
          passedArr = [entry.name];
        } else {
          passedArr = arr.slice();
          passedArr.push(entry.name);
        }

        processOption(option, entry, passedArr, finalLoop);
      }
    }
  };

  // now format it all properly
  for (let i = 0; i < organizedOptions.length; i++) {
    // get the option we're looking at
    let option = organizedOptions[i];

    // we need to know if this is the final loop or not
    const finalLoop = i === organizedOptions.length - 1;

    // so we need to process these options
    processOption(option, formattedProduct, null, finalLoop);
  }

  return formattedProduct;
};
