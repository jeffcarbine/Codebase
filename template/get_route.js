import { shopify_client, shopPromise } from "../apis/shopify.js";
import authRender from "../periodic/components/auth/auth-render.js";
import { banner } from "../static/banner.js";

const get_route = (req, res, next, func) => {
  let checkoutId = req.cookies["checkoutId"],
    query = req.query,
    discountCode = query.discountCode,
    cartPromise;

  const callback = (path = "", values = {}, status = 200) => {
    const promises = [shopPromise, cartPromise];

    // if there isn't a value called "path", then assume
    // the path value is the same as the path variable
    if (values.path === undefined) {
      values.path = "/" + path;
    }

    // if there isn't a value called "subtitle", then assume
    // the subtitle value is the same as the path, but capitalized
    if (values.subtitle === undefined) {
      values.subtitle = path.charAt(0).toUpperCase() + path.slice(1);
    }

    // check to see if we have a valid banner message
    const now = new Date(),
      expiration = new Date(banner.expires);

    if (now < expiration) {
      values.banner = banner;
    }

    return Promise.all(promises).then((result) => {
      values.shop = result[0];
      values.cart = result[1];

      authRender(req, res, path, values, status);
    });
  };

  const prepCartPromise = (checkoutId) => {
    const setCartPromise = () => {
      cartPromise = shopify_client.checkout.fetch(checkoutId);
      func(callback);
    };

    if (discountCode) {
      setTimeout(() => {
        shopify_client.checkout.addDiscount(checkoutId, discountCode);

        setCartPromise();
      }, 250);
    } else {
      setCartPromise();
    }
  };

  // if no checkoutId is supplied, then we need to create
  // a new one
  if (!checkoutId) {
    checkoutId = shopify_client.checkout.create().then((checkout) => {
      res.cookie("checkoutId", checkout.id);

      prepCartPromise(checkout.id);
    });
  } else {
    prepCartPromise(checkoutId);
  }
};

const get_admin_route = (req, res, next, func) => {
  // only run the function if we are admin
  if (req.user.admin) {
    get_route(req, res, next, func);
  } else {
    // send to the homepage
    get_route(req, res, next, (mainCallback) => {
      return mainCallback("error");
    });
  }
};

export { get_route, get_admin_route };
