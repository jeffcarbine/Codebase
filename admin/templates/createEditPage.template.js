import { TOGGLESINGLE } from "../../components/toggle/toggleSingle.component.js";
import * as e from "../../elements/elements.js";
import * as c from "../../components/components.js";
import { wildcardEnum } from "../models/Page.js";

export const createEditPageTemplate = (page = {}) => {
  const pageProvided = Object.keys(page).length > 0,
    title = pageProvided ? "Edit Page" : "New Page",
    saveText = pageProvided ? "Save Changes" : "Create New Page",
    name = pageProvided ? page.name : "",
    path = pageProvided ? page.path : "",
    wildcard = pageProvided ? page.wildcard : false,
    homepage = pageProvided ? page.homepage : false,
    _id = pageProvided ? page._id : "";

  return new e.FORM({
    id: "addEditPage",
    method: "POST",
    action: "/periodic/admin/pages",
    class: "style-inputs",
    children: [
      new e.H2(title),
      new c.FIELD({ name: "name", label: "Name", value: name }),
      new c.FIELD({ name: "path", label: "Path", value: path }),
      new c.FIELD({
        label: "Wildcard",
        type: "select",
        name: "wildcard",
        options: wildcardEnum,
        selected: wildcard,
      }),
      TOGGLESINGLE({
        name: "homepage",
        label: "Set as Homepage",
        checked: homepage,
      }),
      new e.HIDDEN({
        if: pageProvided,
        name: "_id",
        value: page._id,
      }),
      new c.BTN({
        id: "createPage",
        textContent: saveText,
      }),
    ],
  });
};
