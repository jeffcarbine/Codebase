import { toggleSwitchTemplate } from "../../components/toggleswitch/toggleswitch.template.js";
import * as e from "../../elements/elements.js";

export const createEditPageTemplate = (page = {}) => {
  const pageProvided = Object.keys(page).length > 0,
    action = pageProvided ? "/admin/pages/edit" : "/admin/pages/add",
    title = pageProvided ? "Edit Page" : "New Page",
    saveText = pageProvided ? "Save Changes" : "Create New Page",
    name = pageProvided ? page.name : "",
    wildcard = pageProvided ? page.wildcard : false;

  return new e.FORM({
    id: "addEditPage",
    method: "POST",
    action,
    class: "style-inputs",
    children: [
      new e.H2(title),
      new e.TEXT({ name: "name", label: "Name", value: name }),
      toggleSwitchTemplate({
        name: "wildcard",
        label: "Use Wildcard",
        checked: wildcard,
      }),
      new e.HIDDEN({
        if: pageProvided,
        name: "_id",
        value: page._id,
      }),
      new e.BTN({
        id: "createPage",
        textContent: saveText,
      }),
    ],
  });
};
