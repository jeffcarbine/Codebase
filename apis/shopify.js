import * as dotenv from "dotenv";
dotenv.config();

import { getExchangeRate } from "./currencyapi.js";
import asyncLoop from "node-async-loop";

import geoip from "geoip-lite";
import { countryToCurrency } from "../modules/countryToCurrency/countryToCurrency.js";

// SHOPIFY
//import Client from "shopify-buy";
import Client from "shopify-buy-with-tags-updated/index.unoptimized.umd.js";
import fetch from "node-fetch";
import Product from "../models/Product.js";

global.fetch = fetch;

const shopifyToken = process.env.SHOPIFYTOKEN,
  shopifyDomain = process.env.SHOPIFYDOMAIN;

export let shopify, shopPromise, productsPromise;

if (shopifyToken !== undefined) {
  shopify = Client.buildClient({
    storefrontAccessToken: shopifyToken,
    domain: shopifyDomain,
  });

  shopPromise = shopify.shop.fetchInfo();
  productsPromise = shopify.product.fetchAll();
}

export const convertCheckoutCurrency = (
  { checkout, req, country } = {},
  callback
) => {
  if (country === undefined) {
    // get the country
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      lookup = geoip.lookup(ip);

    country = lookup === null ? process.env.DEVCOUNTRYCODE : lookup.country;
  }

  const checkoutCurrency = checkout.lineItems[0]?.variant.price.currencyCode,
    countryCurrency = countryToCurrency(country);

  // if they don't match, we need to update that info
  if (checkoutCurrency !== countryCurrency) {
    getExchangeRate(checkoutCurrency, countryCurrency, (rate) => {
      // update the subtotal with the new currency
      checkout.subtotalPrice__converted = {
        amount: Math.ceil(
          parseFloat(checkout.subtotalPrice.amount) * rate + 0.5
        ), // adding $.50 to help push up to match Shopify
        currencyCode: countryCurrency,
      };

      // update the lineItemsSubtotalPrice with the new currency
      checkout.lineItemsSubtotalPrice__converted = {
        amount: Math.ceil(
          parseFloat(checkout.lineItemsSubtotalPrice.amount) * rate + 0.5
        ), // adding $.50 to help push up to match Shopify
        currencyCode: countryCurrency,
      };

      const lineItems = checkout.lineItems;

      // now asyncLoop through the lineItems
      asyncLoop(
        lineItems,
        (lineItem, next) => {
          // get the price and the compareAtPrice
          const price = parseFloat(lineItem.variant.price.amount),
            compareAtPrice = parseFloat(
              lineItem.variant.compareAtPrice?.amount
            );

          // and add it to the variant
          lineItem.variant.price__converted = {
            // round the price up to the next whole number
            amount: Math.ceil(price * rate + 0.5), // adding $.50 to help push up to match Shopify
            currencyCode: countryCurrency,
          };

          // if there is a compareAtPrice
          if (compareAtPrice !== undefined) {
            // add it to the variant
            lineItem.variant.compareAtPrice__converted = {
              // round the price up to the next whole number
              amount: Math.ceil(compareAtPrice * rate + 0.5), // adding $.50 to ehlp push up to match Shopify
              currencyCode: countryCurrency,
            };
          }

          next();
        },
        (err) => {
          if (err) {
            console.error(err);
          } else {
            callback(checkout);
          }
        }
      );
    });
  } else {
    callback(checkout);
  }
};

/**
 * Converts the currency of a product variant based on a given rate and target currency.
 *
 * @param {Object} variant - The product variant whose currency needs to be converted.
 * @param {number} rate - The conversion rate from the original currency to the target currency.
 * @param {string} countryCurrency - The currency code of the target currency.
 * @returns {Object} The product variant with the converted currency.
 */
const convertVariantCurrency = (variant, rate, countryCurrency) => {
  // get the price and the compareAtPrice
  const price = parseFloat(variant.price.amount),
    compareAtPrice = parseFloat(variant.compareAtPrice?.amount);

  // and add it to the variant
  variant.price__converted = {
    // round the price up to the next whole number
    amount: Math.ceil(price * rate + 0.5), // adding $.50 to help push up to match Shopify
    currencyCode: countryCurrency,
  };

  // if there is a compareAtPrice
  if (compareAtPrice !== undefined) {
    // add it to the variant
    variant.compareAtPrice__converted = {
      // round the price up to the next whole number
      amount: Math.ceil(compareAtPrice * rate + 0.5), // adding $.50 to ehlp push up to match Shopify
      currencyCode: countryCurrency,
    };
  }

  return variant;
};

/**
 * Converts the currency of a product based on the client's country.
 *
 * @param {Object} product - The product whose currency needs to be converted.
 * @param {Object} req - The HTTP request object, used to get the client's IP address.
 * @param {string} country - The country code of the client's country.
 * @param {Function} callback - The callback function to be called after the currency conversion.
 */
export const convertProductCurrency = (
  { product, req, country } = {},
  callback
) => {
  if (country === undefined) {
    // get the country
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      lookup = geoip.lookup(ip);

    country = lookup === null ? process.env.DEVCOUNTRYCODE : lookup.country;
  }

  // check the currency code of the product
  const productCurrency = product.variants[0].price.currencyCode,
    countryCurrency = countryToCurrency(country);

  // if they don't match, we need to update that info
  if (productCurrency !== countryCurrency) {
    getExchangeRate(productCurrency, countryCurrency, (rate) => {
      // now asyncLoop through the variants
      asyncLoop(
        product.variants,
        (variant, next) => {
          variant = convertVariantCurrency(variant, rate, countryCurrency);

          next();
        },
        (err) => {
          if (err) {
            console.error(err);
          } else {
            callback(product);
          }
        }
      );
    });
  } else {
    callback(product);
  }
};

/**
 * Converts the currency of a collection of products based on the client's country.
 *
 * @param {Object} collection - The collection of products whose currency needs to be converted.
 * @param {Object} req - The HTTP request object, used to get the client's IP address.
 * @param {string} country - The country code of the client's country.
 * @param {Function} callback - The callback function to be called after the currency conversion.
 */
export const convertCollectionCurrency = (
  { collection, req, country } = {},
  callback
) => {
  if (country === undefined) {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      lookup = geoip.lookup(ip);

    country = lookup === null ? process.env.DEVCOUNTRYCODE : lookup.country;
  }

  // check the currency code of the products in the collection
  const collectionCurrency =
      collection.products[0].variants[0].price.currencyCode,
    countryCurrency = countryToCurrency(country);

  // if they don't match, we need to update that info
  if (collectionCurrency !== countryCurrency) {
    getExchangeRate(collectionCurrency, countryCurrency, (rate) => {
      // now asyncLoop through the products
      asyncLoop(
        collection.products,
        (product, next) => {
          // asyncLoop through the variants
          asyncLoop(
            product.variants,
            (variant, next) => {
              variant = convertVariantCurrency(variant, rate, countryCurrency);

              next();
            },
            (err) => {
              if (err) {
                console.error(err);
              } else {
                next();
              }
            }
          );
        },
        (err) => {
          if (err) {
            console.error(err);
          } else {
            callback(collection);
          }
        }
      );
    });
  } else {
    callback(collection);
  }
};

/**
 * Retrieves the shopping cart for the client, converting the currency of the products based on the client's country.
 *
 * @param {Object} req - The HTTP request object, used to get the client's IP address and cookies.
 * @param {Object} res - The HTTP response object, used to send the response back to the client.
 */
export const getCart = (req, res) => {
  let checkoutId = req.cookies["checkoutId"];

  // check for null variants, which will require a new checkout
  const noNullVariants = (checkout) => {
    const lineItems = checkout.lineItems;

    for (let i = 0; i < lineItems.length; i++) {
      const lineItem = lineItems[i],
        variant = lineItem.variant;

      if (variant === null) {
        return false;
      }
    }

    return true;
  };

  // when a checkout is completed, it doesn't automatically clear
  // it from your cookies, so we need to check at time of retrieval
  // whether or not this checkout has been completed or not
  const verifyCheckout = (checkoutId) => {
    return shopify.checkout.fetch(checkoutId).then((checkout) => {
      // verify that checkoutId is valid
      // check to see if the checkout has already been completed

      if (
        checkout === null ||
        checkout.completedAt !== null ||
        !noNullVariants(checkout)
      ) {
        // then let's clear the checkoutId cookie
        req.cookies["checkoutId"] = null;
        // and re-fetch the cart
        getCart(req, res);
      } else {
        // otherwise, we're good and can send the checkout

        // check to see if we need to be converting currency
        if (process.env.CONVERTCURRENCY === "true") {
          // check the currency code of the products in the collection
          const checkoutCurrency =
            checkout.lineItems[0]?.variant.price.currencyCode;

          if (checkoutCurrency !== undefined) {
            convertCheckoutCurrency({ checkout, req }, (convertedCheckout) => {
              return res.status(200).send(convertedCheckout);
            });
          } else {
            return res.status(200).send(checkout);
          }
        } else {
          return res.status(200).send(checkout);
        }
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

/**
 * Converts an array of tag objects into an array of tag strings.
 *
 * @param {Object[]} tagsArray - The array of tag objects. Each object should have a 'value' property that is the tag string.
 * @returns {string[]} An array of tag strings.
 */
const simpleTags = (tagsArray) => {
  const tags = [];

  for (let i = 0; i < tagsArray.length; i++) {
    const tagObject = tagsArray[i],
      tag = tagObject.value;

    tags.push(tag);
  }

  return tags;
};

/**
 * Formats a product object into a specific structure and sorts its options.
 *
 * @param {Object} product - The product object to be formatted.
 * @param {string} country - The country code for the client's location.
 * @param {Function} callback - The callback function to be called after the product is formatted.
 */
export const formatProduct = (product, country, callback) => {
  const formatter = (product) => {
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
        tags: simpleTags(product.tags),
        type: product.productType,
        metafields: product.metafields,
        handle: product.handle,
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
                value.price__converted = variant.price__converted;
                value.compareAtPrice = variant.compareAtPrice;
                value.compareAtPrice__converted =
                  variant.compareAtPrice__converted;
                value.imageid =
                  variant.image !== null
                    ? "imageid" +
                      variant.image.id.substring(
                        variant.image.id.lastIndexOf("/") + 1
                      )
                    : "";

                if (formattedProduct.price === null) {
                  formattedProduct.price = variant.price;
                }

                if (
                  formattedProduct.price__converted === undefined &&
                  variant.price__converted !== undefined
                ) {
                  formattedProduct.price__converted = variant.price__converted;
                }

                if (formattedProduct.compareAtPrice === null) {
                  formattedProduct.compareAtPrice = variant.compareAtPrice;
                }

                if (
                  formattedProduct.compareAtPrice__converted === undefined &&
                  variant.compareAtPrice__converted !== undefined
                ) {
                  formattedProduct.compareAtPrice__converted =
                    variant.compareAtPrice__converted;
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

    // find this product by id in the database and update it
    Product.findOneAndUpdate({ id: formattedProduct.id }, formattedProduct, {
      upsert: true,
    }).exec((err, product) => {
      if (err) {
        console.log(err);
      }
    });

    if (callback) {
      callback(formattedProduct);
    } else {
      return formattedProduct;
    }
  };

  if (process.env.CONVERTCURRENCY === "true") {
    convertProductCurrency(
      {
        product,
        country,
      },
      (product) => {
        formatter(product);
      }
    );
  } else {
    formatter(product);
  }
};

/**
 * Retrieves the metafields of a product.
 *
 * @param {Object} options - An object containing the options for the function.
 * @param {string} options.productId - The ID of the product whose metafields are to be retrieved.
 * @param {string[]} [options.keys=[]] - An array of keys of the metafields to be retrieved.
 * @param {string} [options.namespace="custom"] - The namespace of the metafields to be retrieved.
 * @param {Function} options.callback - The callback function to be called after the metafields are retrieved.
 */
export const getMetafields = ({
  productId,
  keys = [],
  namespace = "custom",
  callback,
} = {}) => {
  const generateIdentifiers = () => {
    const identifiers = [];

    keys.forEach((key) => {
      identifiers.push({ namespace, key });
    });

    return identifiers;
  };

  const productsQuery = shopify.graphQLClient.query((root) => {
    root.addConnection("products", { args: { first: 249 } }, (product) => {
      product.add(
        "metafields",
        {
          args: {
            identifiers: generateIdentifiers(),
          },
        },
        (metafield) => {
          metafield.add("namespace");
          metafield.add("key");
          metafield.add("value");
        }
      );
    });
  });

  // Call the send method with the custom products query
  shopify.graphQLClient.send(productsQuery).then(({ model, data }) => {
    const products = model.products,
      product = products.find((o) => o.id === productId),
      metafields = product.metafields;

    callback(metafields);
  });
};

/**
 * Retrieves a specific metafield of a product.
 *
 * @param {Object} options - An object containing the options for the function.
 * @param {string} options.productId - The ID of the product whose metafield is to be retrieved.
 * @param {string} options.key - The key of the metafield to be retrieved.
 * @param {string} [options.namespace="custom"] - The namespace of the metafield to be retrieved.
 * @param {Function} options.callback - The callback function to be called after the metafield is retrieved.
 */
export const getMetafield = ({
  productId,
  key,
  namespace = "custom",
  callback,
} = {}) => {
  const productsQuery = shopify.graphQLClient.query((root) => {
    root.addConnection("products", { args: { first: 249 } }, (product) => {
      product.add(
        "metafields",
        {
          args: {
            identifiers: [{ namespace, key }],
          },
        },
        (metafield) => {
          metafield.add("namespace");
          metafield.add("key");
          metafield.add("value");
        }
      );
    });
  });

  // Call the send method with the custom products query
  shopify.graphQLClient.send(productsQuery).then(({ model, data }) => {
    const products = model.products,
      product = products.find((o) => o.id === productId),
      metafield =
        product.metafields[0] !== null ? product.metafields[0].value : null;

    callback(metafield);
  });
};

/**
 * Retrieves the total inventory and crowdfunding goal of a product.
 *
 * @param {string} productId - The ID of the product whose total inventory and crowdfunding goal are to be retrieved.
 * @param {Function} mainCallback - The callback function to be called after the total inventory and crowdfunding goal are retrieved. The function is called with two arguments: the total inventory and the crowdfunding goal.
 */
export const getProductTotalInventory = (productId, mainCallback) => {
  const productsQuery = shopify.graphQLClient.query((root) => {
    root.addConnection("products", { args: { first: 249 } }, (product) => {
      product.add("title");
      product.add("totalInventory");
      product.add(
        "metafields",
        {
          args: {
            identifiers: [{ namespace: "custom", key: "crowdfund_goal" }],
          },
        },
        (metafield) => {
          metafield.add("namespace");
          metafield.add("key");
          metafield.add("value");
        }
      );
    });
  });

  // Call the send method with the custom products query
  shopify.graphQLClient.send(productsQuery).then(({ model, data }) => {
    const products = model.products,
      product = products.find((o) => o.id === productId),
      inventory = product.totalInventory,
      crowdfund_goal = parseInt(product.metafields[0].value);

    mainCallback(inventory, crowdfund_goal);
  });
};

/**
 * Retrieves all products, including their crowdfunding goals.
 *
 * @param {Function} callback - The callback function to be called after the products are retrieved. The function is called with the products as the argument.
 * @param {string} [pageInfo=null] - The cursor for pagination. If provided, the function retrieves the products after this cursor.
 */
export const getAllProducts = (callback, pageInfo = null) => {
  const productsQuery = shopify.graphQLClient.query((root) => {
    root.addConnection(
      "products",
      { args: { first: 249, after: pageInfo } },
      (product) => {
        product.add(
          "metafields",
          {
            args: {
              identifiers: [{ namespace: "custom", key: "crowdfund_goal" }],
            },
          },
          (metafield) => {
            metafield.add("namespace");
            metafield.add("key");
            metafield.add("value");
          }
        );
      }
    );
  });

  // Call the send method with the custom products query
  shopify.graphQLClient.send(productsQuery).then(({ model, data }) => {
    const products = model.products;
    const pageInfo = data.products.pageInfo;

    if (pageInfo.hasNextPage) {
      getAllProducts(callback, pageInfo.endCursor);
    } else {
      callback(products);
    }
  });
};
