export const showFormTemplate = (e, c, { showData, action } = {}) => {
  console.log(showData);

  return new e.FORM({
    method: "POST",
    action,
    class: "style-inputs xhr",
    "data-redirect": "/periodic/admin/shows",
    children: [
      new e.H2(showData === undefined ? "New Show" : `Edit ${showData?.title}`),
      new c.FIELD({
        name: "title",
        label: "Title",
        value: showData?.title || "",
      }),
      new c.FIELD({
        name: "releaseSchedule",
        label: "Release Schedule",
        value: showData?.releaseSchedule || "",
      }),
      new c.FIELD({
        type: "textarea",
        name: "description",
        label: "Description",
        value: showData?.description || "",
      }),
      new c.FIELD({
        name: "rss",
        label: "RSS",
        value: showData?.rss || "",
      }),
      new c.FIELD({
        name: "patreon",
        label: "Patreon",
        value: showData?.patreon || "",
      }),
      new c.FIELD({
        name: "spotify",
        label: "Spotify",
        value: showData?.spotify || "",
      }),
      new c.FIELD({
        name: "youTube",
        label: "YouTube",
        value: showData?.youTube || "",
      }),
      new c.FIELD({
        name: "apple",
        label: "Apple",
        value: showData?.apple || "",
      }),
      new c.BTN({
        textContent: showData === undefined ? "Add Show" : "Update Show",
      }),
    ],
  });
};
