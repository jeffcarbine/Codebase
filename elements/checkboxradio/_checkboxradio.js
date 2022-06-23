function syncCheckbox(checkbox) {
  if (checkbox.checked) {
    checkbox.setAttribute("value", true);
  } else {
    checkbox.setAttribute("value", false);
  }
}

function initCheckboxes() {
  let checkboxes = document.querySelectorAll("input[type=checkbox]");

  loop(checkboxes, function(checkbox) {
    syncCheckbox(checkbox);
    checkbox.classList.add("initialized");
  });
}

addEventDelegate("load", window, initCheckboxes);
addEventDelegate("change", "input[type=checkbox]", syncCheckbox);

// force one radio to have checked property for every name set
// this seems extraneous, perhaps we should consider removing it?

function getRadioSets() {
  let radios = document.querySelectorAll(
    "input[type=radio]:not(.radio-verified)"
  );
  let radioSets = {};

  loop(radios, function(radio) {
    if (radioSets[radio.name] === undefined) {
      radioSets[radio.name] = [];
    }

    radioSets[radio.name].push(radio);

    radio.classList.add("radio-verified");
  });

  for (var key in radioSets) {
    let radioSet = radioSets[key];
    setRadioChecked(radioSet);
  }
}

function setRadioChecked(radioSet) {
  var setChecked = true;
  var firstRadio;

  loop(radioSet, function(radio, i) {
    if (i === 0) {
      firstRadio = radio;
    }

    if (radio.checked) {
      setChecked = false;
    }
  });

  if (setChecked) {
    firstRadio.checked = true;
  }
}

addEventDelegate("load", window, getRadioSets);
//addEventDelegate("childList", "input[type=radio]", getRadioSets);
