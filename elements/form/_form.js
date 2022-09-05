////////////////////
// FORCE LINE BREAKS
////////////////////
// to keep things looking good, we
// are going to force line breaks
// after the last .inline elmeent
// in the form

// again, this seems extraneous and perhaps we
// should consider not doing this
function convertBreak(br) {
  let parent = br.parentNode;

  // insert our break element after
  // the br
  let linebreak = document.createElement("span");
  linebreak.classList = "linebreak";
  parent.insertBefore(linebreak, br);

  // remove the br
  br.remove();
}

window.addEventListener("load", function () {
  let forms = document.querySelectorAll("form");

  loop(forms, function (form) {
    let brs = form.querySelectorAll("br");
    loop(brs, function (br) {
      convertBreak(br);
    });
  });
});

//addEventDelegate("childList", "form br", convertBreak);

// AUTOFILL HELPER

function autofillHelper(form) {
  let inputs = form.querySelectorAll("input");

  loop(inputs, function (input) {
    let label = input.parentNode;
    if (input.value !== "") {
      if (!label.classList.contains("has-value")) {
        label.classList.add("has-value");
      }
    }
  });
}

addEventDelegate("change", "form", autofillHelper);
