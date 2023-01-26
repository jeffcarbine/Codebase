const downloadCrossOriginFile = (req, res, next) => {
  // Create a HTTPS request
  const externalRequest = https.request(url, {
    headers: {
      // You can add headers like authorization or user agent strings here.
      // Accept: '*/*',
      // 'User-Agent': '',
    },
  }, (externalResponse) => {
    // This callback won't start until `.end()` is called.

    // To make life easier on ourselves, we can copy some of the headers
    // that the server sent your Node app and pass them along to the user.
    headerAllowList
      .filter(header => header in externalResponse.headers)
      .forEach(header => res.set(header, externalResponse.headers[header]));

    // If we didn't have content-type in the above headerAllowList, 
    // you could manually tell browser to expect a PDF file.
    // res.set('Content-Type', 'application/pdf');

    // Suggest a filename
    res.attachment('some-file.pdf');

    // Start piping the ReadableStream to Express' res.
    externalResponse.pipe(res);
  });

  externalRequest.on('error', (err) => {
    next(err);
  });

  // Start executing the HTTPS request
  externalRequest.end();
});