import { generateUniqueId } from "../../modules/generateUniqueId/generateUniqueId.js";
import * as e from "../elements.js";

export const base64ImageInputComponent = ({
  label = "Image",
  base64Image = null,
} = {}) => {
  const id = generateUniqueId();

  return {
    class: "base64ImageInput",
    children: [
      new e.IMG({
        class: "imagePreview",
        src: base64Image,
      }),
      new e.LABEL([
        label,
        new e.FILE({
          name: "imageFile",
          class: "imageFile",
          "data-hiddenInput": id,
        }),
      ]),
      new e.HIDDEN({
        id,
        name: "base64Image",
        value: base64Image,
      }),
    ],
  };
};
