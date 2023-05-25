import { renderTemplate } from "./renderTemplate.js";

export const template_js_engine = (app) => {
  app.engine("template.js", (filePath, options, callback) => {
    import(filePath)
      .then((obj) => {
        const html = renderTemplate(obj.default(options), true);
        return callback(null, html);
      })
      .catch((err) => console.log(err));
  });
};
