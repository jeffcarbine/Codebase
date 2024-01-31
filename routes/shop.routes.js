import async from "async";
import {
  getCart,
  shopify,
  formatProduct,
  getAllProducts,
  convertCollectionCurrency,
} from "../apis/shopify.js";

export const post__shop_collection = (req, res) => {
  const collectionHandle = req.body.collectionHandle,
    count = parseInt(req.body.count) || 8;

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
        if (process.env.CONVERTCURRENCY === "true") {
          convertCollectionCurrency(
            { collection, req },
            (convertedCollection) => {
              callback(null, convertedCollection);
            }
          );
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

export const enableShopRoutes = (app, convertCurrency = false) => {
  app.get("/shop/admin", (req, res) => {
    res.redirect(`https://${process.env.SHOPIFYDOMAIN}/admin`);
  });
  app.post("/shop/collection", (req, res) => {
    return post__shop_collection(req, res, convertCurrency);
  });
  app.post("/shop/cart", post__shop_cart);
  app.post("/shop/add-to-cart", post__shop_addToCart);
  app.post("/shop/modify-line-item", post__shop_modifyLineItem);
};
