import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";
import { toast } from "../alert/alert.js";

export const clickToCopy = async (button) => {
  const text = button.dataset.text,
    parent = button.parentNode;

  button.classList.add("loading");

  try {
    await navigator.clipboard.writeText(text);
    button.classList.remove("loading");
    toast({
      message: "Copied to clipboard!",
      parent,
      small: true,
      status: "success",
    });
  } catch (err) {
    button.classList.remove("loading");
    toast({
      message: "Failed to copy: " + err,
      parent,
      small: true,
      status: "error",
    });
  }
};

addEventDelegate("click", ".clickToCopy .copy", clickToCopy);
