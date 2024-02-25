export const LAZYIMG = (params) => {
  if (params.src) {
    params["data-src"] = params.src;
    delete params.src;
  }

  return {
    tagName: "img",
    "data-component": "lazyImg",
    loading: "lazy",
    ...params,
  };
};
