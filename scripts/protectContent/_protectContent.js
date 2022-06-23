let protectedContent = document.querySelectorAll(".protectContent"),
  cloneNodes = [];

loop(protectedContent, function(content) {
  // so now we need to store this elements and all
  // the children elements as they are
  let indexValue = cloneNodes.length;
  content.dataset.protectedIndex = indexValue;
  let clone = content.cloneNode(true);
  cloneNodes[indexValue] = clone;
});

function protectContent() {
  console.log("running protectContent");
  for (var i = 0; i < cloneNodes.length; i++) {
    let cloneNode = cloneNodes[i].cloneNode(true);
    let originalNode = document.querySelector(
      "[data-protected-index='" + i + "']"
    );

    let parent = originalNode.parentNode;

    parent.replaceChild(cloneNode, originalNode);
  }
}

let protectInterval = null;

if (cloneNodes.length > 0) {
  protectInterval = setInterval(function() {
    protectContent();
  }, 15000);
}
