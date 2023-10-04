import { SPAN, A } from "../../elements/elements.js";
import { carbineCoLogoComponent } from "./carbineCoLogo.component.js";

export const carbineCoCreditComponent = ({
  before = null,
  link = "Jeff Carbine",
  after = " built this website",
} = {}) => {
  return {
    class: "carbine-co-credit",
    children: [
      {
        class: "text",
        child: new SPAN({
          children: [
            new SPAN({
              if: before !== null,
              textContent: before,
            }),
            new A({
              href: "https://carbine.co",
              textContent: link,
            }),
            new SPAN({
              if: after !== null,
              textContent: after,
            }),
          ],
        }),
      },
      {
        class: "carbine-co-logo",
        child: carbineCoLogoComponent,
      },
    ],
  };
};
