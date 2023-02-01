import { renderTemplate } from "./_renderTemplate.js";

export const template_js_engine = (app) => {
  // app.engine("template.js", (templateObj, callback) => {
  //   console.log("made it to the engine!");
  //   //const rendered = renderTemplate(templateObj, true);
  //   const rendered = "<h1>Hello World</h1>";

  //   return callback(null, rendered);
  // });

  app.engine("template.js", (filePath, options, callback) => {
    import(filePath)
      .then((obj) => {
        const html = renderTemplate(obj.default(options), true);
        return callback(null, html);
      })
      .catch((err) => console.log(err));
  });
};

// const fs = require('fs') // this engine requires the fs module
// app.engine('ntl', (filePath, options, callback) => { // define the template engine
//   fs.readFile(filePath, (err, content) => {
//     if (err) return callback(err)
//     // this is an extremely simple template engine
//     const rendered = content.toString()
//       .replace('#title#', `<title>${options.title}</title>`)
//       .replace('#message#', `<h1>${options.message}</h1>`)
//     return callback(null, rendered)
//   })
// })
// app.set('views', './views') // specify the views directory
// app.set('view engine', 'ntl') // register the template engine

// index.ntl
// #title#
// #message#

// app.get('/', (req, res) => {
//   res.render('index', { title: 'Hey', message: 'Hello there!' })
// })
