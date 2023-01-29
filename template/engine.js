import { renderTemplate } from "./_renderTemplate.js";

export const template_js_engine = (app) => {
  app.engine("template.js", (templateObj, callback) => {
    console.log("made it to the engine!");
    const rendered = renderTemplate(templateObj, true);

    return callback(null, rendered);
  });
};
