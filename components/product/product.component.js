import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { SLIDER } from "../../components/slider/slider.component.js";
import { SQUARE } from "../../components/square/square.component.js";

export const PRODUCT = (data, useHeading = true) => {
  const product = data.product;

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
        const radio = new e.RADIOLABEL({
          name: "variant",
          value: value.id,
          id: value.id,
          "data-imageid": value.imageid,
          label: value.name,
        });

        children.push(radio);
      }
    });

    return group;
  };

  return {
    "data-component": "product",
    id: "product",
    children: [
      {
        class: "images-container",
        child: {
          class: "images",
          children: [SLIDER({ elements: generateProductImages() }), SQUARE],
        },
      },
      {
        class: "details",
        children: [
          new e.H2({
            if: useHeading,
            textContent: product.name,
          }),
          new e.SPAN({ class: "price" }),
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
