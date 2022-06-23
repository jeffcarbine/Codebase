///////
// TABS
///////

// borrowed from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  var result = "";
  var characters = "BCDFGHJKLMNPQRSTVWXZbcdfghjklmnpqrstvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getTabIndex(tab) {
  let position = 1;

  while ((tab = tab.previousElementSibling) !== null) {
    position++;
  }

  return position;
}

function initializeTabs() {
  let allTabs = document.querySelectorAll(".tabs");

  loop(allTabs, function(tabs) {
    if (!tabs.classList.contains("initialized")) {
      // assign a random string as tab id
      let tabsId = "tabs-" + makeid(5);
      tabs.id = tabsId;

      let firstTab = document.querySelector(".tabs#" + tabsId + " > ul > li");
      let firstPanel = tabs.querySelector(".tabs#" + tabsId + " > div");

      firstTab.classList.add("active");
      firstPanel.classList.add("active");

      // set data attribute helper
      tabs.dataset.activePanel = 1;

      tabs.classList.add("initialized");
    }
  });

  measureTabs();
}

initializeTabs();

//addEventDelegate("childList", ".tabs:not(.initialized)", initializeTabs);

function changeTab(tab) {
  let tabs = tab.parentNode.parentNode;
  let tabsId = tabs.id;
  let activeTab = document.querySelector(
    ".tabs#" + tabsId + " > ul > li.active"
  );

  if (tab !== activeTab) {
    // figure out which child the tab is
    let index = getTabIndex(tab);

    // remove the active state from the tab
    activeTab.classList.remove("active");
    let activePanel = document.querySelector(
      ".tabs#" + tabsId + " > div.active"
    );
    activePanel.classList.remove("active");

    // and add active states to the correct
    // tab and panel
    tab.classList.add("active");
    let panel = document.querySelector(
      ".tabs#" + tabsId + "> div:nth-of-type(" + index + ")"
    );
    panel.classList.add("active");

    // and add the data attribute to help
    // out with the slider
    tabs.dataset.activePanel = index;
  }

  measureTabs();
}

addEventDelegate("click", ".tabs > ul li", changeTab);

// MEASURE AND REMEASURE
function measureTabs() {
  let allTabs = document.querySelectorAll(".tabs");

  // loop through them all
  loop(allTabs, function(tabs) {
    let tabsId = tabs.id;

    let tablist = document.querySelector(".tabs#" + tabsId + " > ul");
    let tablistHeight = tablist.offsetHeight;

    // get the active panel
    let activePanel = document.querySelector(
      ".tabs#" + tabsId + "> div.active"
    );
    let activePanelHeight = activePanel.offsetHeight;

    tabs.style.height = tablistHeight + activePanelHeight + "px";
  });
}

addEventDelegate("onload", window, measureTabs);
addEventDelegate("childList", ".tabs div", measureTabs);
