/**
 * Event Delegate
 * @file This controls how events are registered and executed in Codebase
 * @use To use an event delegate, call a function similar to this:
 *
 * addEventDelegate(event, target, function, preventDefault);
 *
 * @param {string} event : This is a string of the event you want to register a delegate
 * for. For individual elements, you can only pass elements that bubble as well as a
 * mutation types such as childList. For window events, you can call either "load" or "resize".
 *
 * @param {string|window} target : Either a query selector string or the window, depending on the
 * kind of event you are trying to listen to
 *
 * @param {function} function : Either a defined function as a variable name only (no parenthesis), or
 * an anonymous function. The function takes two parameters, target and event
 *      @param {node} target : This will be the specific node that experienced the bubbled event
 *      @param {Event} event : This is the event that bubbled
 *
 *  @param {boolean} preventDefault whether to prevent default on the event
 *      @default true for click events
 */

/**
 * Environment Detection
 * Allows us to detech properly whether the user is in a click
 * environment or a touch environment
 *
 * @notes A touch on a mobile device registers both a mousedown as well as
 * a touchstart event, so the following functions account for that behavior
 * to determine whether it is a touch device (touchstart followed by mousedown)
 * or a click device (mousedown only)
 */

// global boolean for registering when a touch has occurred
let touchDetected = false;

/**
 * This checks if the event passed to it is a touch or not
 * @param {Event} event either a touchstart or mousedown event
 */
function checkEnvironment(event) {
  if (event.type === "touchstart") {
    window.touchEnvironment = true;
  } else {
    window.touchEnvironment = false;
  }
}

/**
 * This registers the touchstart event used to detect touch environments
 * @param {Event} event the touchstart event
 */
window.addEventListener(
  "touchstart",
  function (event) {
    // if we aren't already in a touch environment, then
    // pass the touchstart to checkEnvironment so it can
    // register a touch
    if (!window.touchEnvironment) {
      checkEnvironment(event);
    }

    // set our global touchDetected bool to true
    touchDetected = true;
  },
  false
);

/**
 * This registers the mousedown event used to detect click environments
 * @param {Event} event the mousedown event
 */
window.addEventListener(
  "mousedown",
  function (event) {
    // if a touch wasn't detected previous to this event (since touch devices
    // also register a mousedown) AND we we are currently in a touch environment,
    // pass the mousedown to checkEnvironment so it can register a click
    if (!touchDetected && window.touchEnvironment) {
      checkEnvironment(event);
    }

    // set our global touchDetected bool to false since this is a mousedown
    touchDetected = false;
  },
  false
);

/**
 * Event Registration
 * This creates the objects and arrays that store the functions that will
 * run on their corresponding events
 *
 * @notes The onresizeFunctions and onloadFunctions arrays are separate from the delegate object
 * because all the members of their arrays are run on their corresponding window events while the delegate
 * object only returns functions if the event.target matches the object key that the function is stored under
 */

/**
 * Run on Resize and Run on Load
 * These functions are registered to the window.onresize and window load event and will
 * loop through all their children functions
 */

// array of functions that will be run on resize
const onresizeFunctions = [];

// the looping function for resize
const runOnResize = () => {
  // simple loop to go through the array and execute
  // each function
  for (var i = 0; i < onresizeFunctions.length; i++) {
    let func = onresizeFunctions[i];
    func();
  }
};

// registering the function to the window event
window.onresize = runOnResize;

// arary of functions that will be run on window load
const onloadFunctions = [];

// the looping function for load
const runOnLoad = () => {
  // simple loop to go through the array and execute
  // each function
  for (var i = 0; i < onloadFunctions.length; i++) {
    let func = onloadFunctions[i];
    func();
  }
};

// registering the function to the window event
window.addEventListener("load", function () {
  // we run this function on a minor timeout
  // just to help ensure that any event delegates
  // registered in external js files have time to
  // be added to the array before we run through it
  runOnLoad();
});

// array of functions that will be run on window scroll
const scrollFunctions = [];

// 120fps scroll throttling
let lastKnownScrollPosition = 0;
let ticking = false;

// register the function to the
document.addEventListener("scroll", function (e) {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    setTimeout(function () {
      for (var i = 0; i < scrollFunctions.length; i++) {
        let func = scrollFunctions[i];
        func(lastKnownScrollPosition);
      }

      ticking = false;
    }, 8.33); // 120fps

    ticking = true;
  }
});

/**
 * Add Event Delegate
 * This is the function that registers the functions to their corresponding
 * events and event targets.
 *
 * @notes The use of this is detailed in the first comment in this file
 */

const addEventDelegate = (event, target, func, preventDefault = false) => {
  // first, we need to check what kind of event is being registered
  // -- if it is a load or resize function that are being set to the
  // window, then they need to be handled differently and just get
  // pushed to their corresponding arrays
  if (event.indexOf("load") > -1 && target === window) {
    onloadFunctions.push(func);
  } else if (event.indexOf("resize") > -1 && target === window) {
    onresizeFunctions.push(func);
  } else if (event.indexOf("scroll") > -1 && target === window) {
    scrollFunctions.push(func);
  } else {
    // if the event delegate object
    // is still empty, then the event
    // listener doesn't exist either
    // - so we need to set that event
    // listener up

    // first check to see if we have spaces,
    // ergo: multiple events to register
    if (event.indexOf(" ") >= 0) {
      // split into array and set arrays
      let events = event.split(/[ ,]+/); // regex that splits spaced strings into arrays
      // loop through the events
      for (var i = 0; i < events.length; i++) {
        // get the event
        let _event = events[i];
        // now pass it, it's target and the function to
        // our registerEvent function below
        registerEvent(_event, target, func, preventDefault);
      }
    } else {
      // it's just one target, so we can
      // register the function in
      // our delegate object
      registerEvent(event, target, func, preventDefault);
    }
  }
};

export { addEventDelegate };

/**
 * Register Event
 * This registers the function to our delegate object
 *
 * @notes The delegate object is an object of objects, each of which represents
 * an event that bubbles (and the mutation). Each of those event objects contain
 * functions organized by keys that are the query selector targets that we are matching
 * the events to in our eventHandler function below.
 *
 * @param {string} event the type of event we are registering for
 * @param {string} target the query selector string we are targeting
 * @param {function} func the function that will be run
 */

// the delegate object that stores all of the events, targets and functions
const delegate = {};

const registerEvent = (event, target, func, preventDefault) => {
  // check to see if the object already has an instance of the event (which, if it does, it means we have already
  // registered an Event Listener for it)
  if (delegate[event] === undefined) {
    // if it doesn't, then set that delegate event to an empty object
    delegate[event] = {};

    // if it is a mutation, then we don't need to register an event with the document
    // because mutations are handled below by our mutationObserver
    if (!isValidMutation(event)) {
      // then add a new event listener for that event
      document.addEventListener(event, eventHandler, false);
    } else {
      // then we need to start observing mutations
      observeMutations();
    }
  }

  // now register the function to the delegate
  delegate[event][target] = {
    func: func,
    preventDefault: preventDefault,
  };
};

/**
 * Event Matches
 * This checks whether or not the event passed into our eventHandler matches
 * the target specified
 *
 * @notes To ensure maximum compatibility, we check the target, it's parent and
 * it's grandparent. Since events (click events specifically) report the exact element
 * clicked on, its feasable that a user might click on a child element inside of a clickable
 * element
 *
 * @example
 *      <button><span>Hello</span> world</button>
 *
 * @notes In that example, if the user clicked on the word "Hello" the target returned by the
 * Event would be the <span> element instead of the <button>. But its really the button we want
 * to register our event for.
 * To prevent multiple events, once a match has been found, we stop checking.
 *
 * @param {Event} event the event that we are checking
 * @param {string} key the string we are trying to match with
 */

// global target storage
var target;

const eventMatches = (event, key) => {
  // the element we are trying to match with is the
  // target of the event that we're looking at
  let elem = event.target;

  // loop through the target and all its parents until
  // we either find a match or reach the document
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches(key)) return elem;
  }

  // and if we don't return a match before
  // now, return false
  return false;
};

/**
 * Event Handler
 * This is the function that is run on every registered event that handles executing the function
 * if a match is found
 *
 * @notes To ensure maxiumum usability, we use the Environment Detection above to determine whether
 * click events are handled by the click event or if they are handled by the touchend event. This
 * eliminates the 300ms delay on touch devices.
 *
 * @notes To ensure maxiumum accessibility, we also register enter keypresses as click events so that
 * keyboard users aren't restricted by click events
 *
 * @notes We also extend the disabled attribute in HTML to allow us to disable events. If the target
 * matches, but the node has a disabled attribute, the function won't run
 *
 * @param {Event} event the event that the Event Handler is evaluating
 */

const eventHandler = (event) => {
  // empty eventObj so we can properly pass what
  // delegate event we are going to match this event to
  var eventObj;

  // if this is a keypress, check that it is the enter key
  if (event.type === "keypress") {
    let key = event.which || event.keyCode;
    // if it is the enter key...
    if (key === 13) {
      // .. then we treat it like a click
      eventObj = delegate.click;
    }
    //// if this is a touch environment and the event is a touchend
    //} else if (window.touchEnvironment === true && event.type === "touchend") {
    //    // then merge the touchend and click objects into one...
    //    let mergedObj = Object.assign({}, delegate["touchend"], delegate["click"]);
    //    // ...and pass that as the event object
    //    eventObj = mergedObj;
  } else {
    // otherwise, just get the matching event object
    eventObj = delegate[event.type];
  }

  // loop through delegate array to see if
  // any of our click event targets match
  for (var key in eventObj) {
    // get the function from the event object
    let func = eventObj[key].func;

    // get the preventDefault value from the event object
    let preventDefault = eventObj[key].preventDefault;

    // check whether the element or it's direct parent match
    // the key
    let match = eventMatches(event, key);
    // set the disabled bool
    let disabled = false;

    // if the eventMatches returned a node
    if (match !== false) {
      // stop events if the element is disabled
      if (match.disabled === true) {
        disabled = true;
      }

      // prevent clicks by default unless preventDefault is false
      if (event.type === "click") {
        if (preventDefault !== false) {
          event.preventDefault();
        }
        // and for everything else, prevent default if preventDefault is true
      } else if (preventDefault) {
        event.preventDefault();
      }

      //// stop clicks on mobile
      //if (window.touchEnvironment === true && event.type === "click") {
      //    // return false so we don't make it to the func
      //    return false;
      //}

      // run the function and pass the target
      if (!disabled) {
        func(match, event);
      }
    } else {
      continue;
    }
  }
};

/**
 * Mutation Observer
 * This allows us to observe mutations to the DOM and react to them.
 */

// Options for the observer (which mutations to observe)
const config = {
  attributes: true,
  attributeFilter: [
    "class",
    "id",
    "value",
    "data-icon",
    "data-color-icon",
    "checked",
  ],
  childList: true,
  subtree: true,
};

// check to see if an event is a mutation or not
const isValidMutation = (event) => {
  if (event === "childList" || event.includes("attributes")) {
    return true;
  } else {
    return false;
  }
};

// Callback function to execute when mutations are observed
const callback = (mutationsList) => {
  function runCallback() {
    for (var i = 0; i < mutationsList.length; i++) {
      let mutation = mutationsList[i];

      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        executeCheck(mutation);
      } else if (mutation.type === "attributes") {
        executeCheck(mutation);
      }
    }
  }

  runCallback();
};

const observer = new MutationObserver(callback);

const observeMutations = () => {
  // Select the node that will be observed for mutations
  const targetNode = document.querySelector("body");

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
};

// the previous mutation target, so that we
// don't target the same node
let prevMutationTarget;

const executeCheck = (mutation) => {
  let mutationTarget = mutation.target;

  if (
    mutationTarget !== prevMutationTarget &&
    mutationTarget.dataset.mutated !== true
  ) {
    let type = mutation.type;
    let attributeName = type === "attributes" ? mutation.attributeName : false;

    let funcs = attributeName
      ? delegate[type + ":" + attributeName]
      : delegate[type];

    for (var target in funcs) {
      let func = funcs[target].func;
      var nodes = mutationTarget.querySelectorAll(target);
      var isMutation = false;
      var existsInMutation = false;

      // check to see if the element itself is the
      // mutation or if the element exists as a child
      // of the mutation
      if (mutationTarget.matches(target)) {
        isMutation = true;
      }

      if (!isMutation) {
        existsInMutation = nodes.length > 0 ? true : false;
      }

      if (isMutation) {
        func(mutationTarget, mutation);
        mutationTarget.dataset.mutated = true;
      } else if (existsInMutation) {
        nodes.forEach(function (node) {
          func(node, mutation);
          mutationTarget.dataset.mutated = true;
        });
      }
    }
  }

  prevMutationTarget = mutationTarget;
};

/**
 * Remove Event Delegate
 * Removes an event delegate so it stops firing when
 * you no longer want it to
 *
 */

export const removeEventDelegate = (event, target) => {
  // first check to see if we have spaces,
  // ergo: multiple events to register
  if (event.indexOf(" ") >= 0) {
    // split into array and set arrays
    let events = event.split(/[ ,]+/); // regex that splits spaced strings into arrays
    // loop through the events
    for (var i = 0; i < events.length; i++) {
      // get the event
      let _event = events[i];
      // now pass it, it's target and the function to
      // our registerEvent function below
      deregisterEvent(_event, target);
    }
  } else {
    // it's just one target, so we can
    // register the function in
    // our delegate object
    deregisterEvent(event, target);
  }
};

/**
 * DeRegister Event
 * Removes an event from the delegate object
 *
 * @param {event} event
 * @param {elemnet} target
 */

const deregisterEvent = (event, target) => {
  delete delegate[event][target];
};
