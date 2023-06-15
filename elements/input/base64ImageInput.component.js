import * as e from "../elements.js";

export const base64ImageInputComponent = (id, label = "Image") => {
  return {
    class: "base64ImageInput",
    children: [
      new e.LABEL([
        label,
        new e.FILE({
          name: "imageFile",
          class: "imageFile",
          "data-hiddenInput": id,
        }),
      ]),
      new e.HIDDEN(id),
    ],
  };
};
