import {
  HEADER,
  BODY,
  HTML,
  IMG,
  MAIN,
  HEAD,
  NAVIGATION,
  SCRIPT,
  STYLESHEET,
  FOOTER,
  P,
} from "../../elements.js";

export const base = (data) => {
  return new HTML({
    children: [
      new HEAD({
        children: [
          new STYLESHEET({
            href: "/styles/site.min.css",
          }),
          new SCRIPT({
            async: true,
            src: "https://www.googletagmanager.com/gtag/js?id=G-L5TRS16MQH",
          }),
          new SCRIPT(() => {
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());

            gtag("config", "G-L5TRS16MQH");
          }),
        ],
      }),
      new BODY({
        children: [
          new HEADER({
            child: new IMG({
              src: "/images/logo.svg",
            }),
          }),
          new NAVIGATION({
            Episodes: "/episodes",
            About: "/about",
            Patreon: "/patreon",
            Merch: {
              "All Items": "/shop",
              Shirts: "/shop/collection/shirts",
              Tanks: "/shop/collection/tanks",
              Sweatshirts: "/shop/collection/sweatshirts-hoodies",
              Hats: "/shop/collection/hats",
              "Art & Stickers": "/shop/collection/prints-stickers",
              Accessories: "/shop/collection/accessories",
              "Gift Cards": "/shop/products/naddpod-gift-card",
            },
            "Print Shop": "/print-shop",
            "Live Shows": "/live",
            FAQs: "/faqs",
          }),
          new MAIN(data.main || {}),
        ],
      }),
      new FOOTER({
        children: [
          new IMG({
            src: "/images/footer-logo.svg",
            class: "footer-logo",
          }),
          new P({
            textContent:
              "Copyright " + new Date().getFullYear() + " Carbine Co.",
          }),
        ],
      }),
    ],
  });
};
