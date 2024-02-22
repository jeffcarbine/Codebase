import * as e from "../../elements/elements.js";
import * as c from "../components.js";
import { SLIDER } from "../../components/slider/slider.html.js";
import { SQUARE } from "../../components/square/square.html.js";
import { formatCurrency } from "../../modules/formatCurrency/formatCurrency.js";

export const PRODUCT = ({ data, heading = true, price = true } = {}) => {
  const product = data.product;

  let onSale = false;

  if (product.compareAtPrice) {
    onSale = product.compareAtPrice.amount > product.price.amount;
  }

  let tags = "",
    nsfw = false;

  // loop through the tags and add the values to the tags string
  if (data.tags) {
    data.tags.forEach((tag) => {
      tags += `${camelize(tag.value)} `;

      if (tag.value === "nsfw") {
        nsfw = true;
      }
    });
  }

  const generateProductImages = () => {
    const images = product.images,
      slides = [];

    images.forEach((image) => {
      const img = new e.IMG({
        src: image.src,
        alt: image.talText,
        id: "imageid" + image.id.substring(image.id.lastIndexOf("/") + 1),
      });

      slides.push(img);
    });

    return slides;
  };

  const checkVariants = (values, name, first) => {
    // check to see whether there are more than one value
    if (values.length > 1) {
      return generateVariants(values, name, first);
    } else {
      return new e.HIDDEN({ name: "variant", value: values[0].id });
    }
  };

  const generateVariants = (values, name, first = false) => {
    // if there are more than one variant, show the radios
    const children = [
        {
          class: first ? "mainLegend" : "",
          tagName: "legend",
          textContent: name,
        },
      ],
      group = {
        tagName: "fieldset",
        children,
      };

    values.forEach((value) => {
      if (value.values !== undefined) {
        const childGroup = generateVariants(value.values, value.name);

        children.push(childGroup);
      } else {
        const radio = new c.FIELD({
          type: "fullradio",
          name: "variant",
          value: value.id,
          id: value.id,
          "data-imageid": value.imageid,
          label: value.name,
        });

        // const radio = new e.RADIOLABEL({
        //   name: "variant",
        //   value: value.id,
        //   id: value.id,
        //   "data-imageid": value.imageid,
        //   label: value.name,
        // });

        children.push(radio);
      }
    });

    return group;
  };

  return {
    "data-component": "product",
    id: "product",
    class: `product ${tags}`,
    children: [
      {
        class: "images-container",
        child: {
          class: "images",
          "data-nsfw": nsfw,
          children: [
            SLIDER({ elements: generateProductImages() }),
            new c.ICON("square"),
          ],
        },
      },
      {
        class: "details",
        children: [
          new e.H2({
            if: heading,
            textContent: product.name,
          }),
          new e.SPAN({
            if: price && onSale,
            class: "compareAt",
            textContent: formatCurrency(
              product.compareAtPrice?.amount,
              product.compareAtPrice?.currencyCode
            ),
          }),
          new e.SPAN({
            if: price,
            class: `price ${onSale ? "onSale" : ""}`,
            textContent:
              product.price__converted !== undefined
                ? formatCurrency(
                    product.price__converted.amount,
                    product.price__converted.currencyCode
                  )
                : formatCurrency(
                    product.price.amount,
                    product.price.currencyCode
                  ),
          }),
          new e.SPAN({
            if: price && product.price__converted !== undefined,
            class: "original",
            textContent: `(${formatCurrency(
              product.price.amount,
              product.price.currencyCode
            )})`,
          }),
          {
            class: "description",
            child: new e.P(product.description),
          },
          {
            class: "variants" + (product.values.length === 1 ? " hidden" : ""),
            child: checkVariants(product.values, "Options", true),
          },
          {
            class: "addToCart",
            child: new c.BTNCONTAINER(
              {
                id: "addToCart",
                textContent: "Add to Cart",
              },
              "centered"
            ),
          },
        ],
      },
    ],
  };
};
