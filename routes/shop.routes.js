import async from "async";
import {
  getCart,
  shopify,
  formatProduct,
  getProductTotalInventory,
  getAllProducts,
} from "../apis/shopify.js";
import { capitalize } from "../modules/formatString/formatString.js";
import Product from "../models/Product.js";
import ExchangeRate from "../models/ExchangeRate.js";
import geoip from "geoip-lite";
import { countryToCurrency } from "../modules/countryToCurrency/countryToCurrency.js";
import { getExchangeRate } from "../apis/currencyapi.js";
import asyncLoop from "node-async-loop";

export const post__shop_collection = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    lookup = geoip.lookup(ip),
    country = lookup === null ? process.env.DEVCOUNTRYCODE : lookup.country,
    collectionHandle = req.body.collectionHandle,
    count = parseInt(req.body.count);

  async.waterfall(
    [
      (callback) => {
        shopify.collection
          .fetchByHandle(collectionHandle)
          .then((collection) => {
            const collectionId = collection.id;

            callback(null, collectionId);
          })
          .catch((err) => {
            console.error(err);
          });
      },
      (collectionId, callback) => {
        shopify.collection
          .fetchWithProducts(collectionId, { productsFirst: count })
          .then((collection) => {
            callback(null, collection);
          })
          .catch((err) => {
            console.error(err);
          });
      },
      (collection, callback) => {
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
                    // get the price and the compareAtPrice
                    const price = parseFloat(variant.price.amount),
                      compareAtPrice = parseFloat(
                        variant.compareAtPrice?.amount
                      );

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
                  callback(null, collection);
                }
              }
            );
          });
        } else {
          callback(null, collection);
        }
      },
      (collection) => {
        return res.status(200).send(collection);
      },
    ],
    (err) => {
      return res.status(500).send(err);
    }
  );
};

export const post__shop_cart = (req, res) => {
  return getCart(req, res);
};

export const post__shop_addToCart = (req, res) => {
  const variantId = req.body.variantId;

  // return error if no item was sent
  if (variantId === undefined) {
    return res.status(500).send("No item selected, please try again.");
  }

  const line_item = {
      variantId,
      quantity: 1,
    },
    checkoutId = req.cookies["checkoutId"];

  // Add the variant to our cart
  shopify.checkout
    .addLineItems(checkoutId, line_item)
    .then((checkout) => {
      res.status(200).send(checkout);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

export const post__shop_modifyLineItem = (req, res) => {
  const checkoutId = req.cookies["checkoutId"],
    id = req.body.itemId,
    quantity = parseInt(req.body.quantity);

  // only works if we have a checkoutId
  if (checkoutId !== undefined) {
    if (quantity <= 0) {
      // then delete the product
      return shopify.checkout
        .removeLineItems(checkoutId, [id])
        .then((checkout) => {
          console.log(checkout);

          res.status(200).send(checkout);
        });
    } else {
      return shopify.checkout
        .updateLineItems(checkoutId, [{ id, quantity }])
        .then((checkout) => {
          console.log(checkout);
          res.status(200).send(checkout);
        });
    }
  } else {
    console.log("No checkoutId");
    return res.status(500).send("No checkoutId provided");
  }
};

export const refreshProductArchive = () => {
  console.log("Refreshing product archive");
  getAllProducts((products) => {
    console.log("Refresh complete");

    products.forEach((product) => {
      // request the product data from shopify via the api
      // by product id
      shopify.product.fetch(product.id).then((shopifyProduct) => {
        // format the product data and save it to the database
        formatProduct(shopifyProduct);
      });
    });
  });
};

export const enableShopRoutes = (app) => {
  app.get("/shop/admin", (req, res) => {
    res.redirect(`https://${process.env.SHOPIFYDOMAIN}/admin`);
  });
  app.post("/shop/collection", post__shop_collection);
  app.post("/shop/cart", post__shop_cart);
  app.post("/shop/add-to-cart", post__shop_addToCart);
  app.post("/shop/modify-line-item", post__shop_modifyLineItem);
};
