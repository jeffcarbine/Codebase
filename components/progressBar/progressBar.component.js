export const progressBarComponent = (value, undertext) => {
  const progressBar = {
    class: "progressBar",
    children: [
      {
        tagName: "progress",
        max: 100,
        value,
      },
    ],
  };

  if (undertext) {
    progressBar.children.push({
      class: "undertext",
      textContent: undertext,
    });
  }

  return progressBar;
};
