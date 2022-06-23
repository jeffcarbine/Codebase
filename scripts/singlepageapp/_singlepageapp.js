/**
 * Single Page App
 * This is the function that enables the Single Page App that we use for our documentaiton site.
 * While this currently doesn't have a practical application outside of that, it is a great proof-
 * of-concept that could be expanded and used more widely in the future.
 * 
 * That being said, don't use this in production unless you _really_ know what you're doing
 * 
 * @param {string} root The root path of all your views
 * @param {string} container The querySelector of the element you want those views rendered into
 */

function spa(root, container) {
    // run the initial load
    initialLoad();

    // this runs on the initial load of the page,
    // or after a browser refresh
    function initialLoad() {
        // first, check to see if there is a hash in the
        // url, and if not then we need to add the root
        // hash
        if (window.location.hash === "") {
            window.location.hash = "#/";
        }

        // save the current hash
        let hash = window.location.hash.replace("#/","");

        fetchPartial({
            path: root + "/" + hash + "/",
            container: container,
            script: "scripts"
        });

        // set the initial path's active
        // state using a function borrowed
        // from nav.js
        let initialPathLink = document.querySelector("a[href='/" + hash + "']");
        activateLink(initialPathLink);
    };

    window.addEventListener("hashchange", function () {
        let hash = window.location.hash.replace("#/", "");
        let link = document.querySelector("a[href='/" + hash + "']");

        let params = {
            path: root + "/" + hash + "/",
            container: container,
            script: "scripts"
        };

        fetchPartial(params);

        activateLink(link);
        link.focus();
    });

    addEventDelegate("click", "a:not([target='_blank'])", function (link) {
        let href = link.getAttribute("href");
        if (!(href.indexOf("#") > -1 || href.indexOf("//") > -1)) {
            let hash = link.getAttribute("href");

            // catching relative links that don't have the
            // leading slash
            if (hash.charAt(0) !== "/") {
                hash = "/" + hash;
            }

            // change the hash
            window.location.hash = hash;
        }
    });

    addEventDelegate("click", "nav a", activateLink);

    // borrows from nav to close since we
    // aren't loading new pages
    addEventDelegate("click", "nav ul a", close);
}

// make whatever link you click on in the
// nav the active page (for spas)
function activateLink(target) {
    let currActives = document.querySelectorAll("nav .active");

    if (currActives.length > 0) {
        loop(currActives, function (currActive) {
            currActive.classList.remove("active");
        });
    }

    target.parentNode.classList.add("active");

    // if it is a child link, we need to
    // mark the parent as active as well
    function checkIfSub(target) {
        let parent = target.parentNode;
        let grandparent = parent.parentNode;
        let greatGrandparent = grandparent.parentNode;

        if (!grandparent.matches("nav > ul")) {
            greatGrandparent.classList.add("active");

            checkIfSub(grandparent);
        }
    }

    checkIfSub(target);
}

// this handles the partial loading
// of the spa
// main function that handles fetching the partials
function fetchPartial(params) {
    // the params are as follows:
    //
    //  {
    //      path: path to partial
    //      partial: "partial name",
    //      container: "main rendering container",
    //      insert: "prepend", "append", or "replace" - default behavior is replace
    //      script: name of script if it exists
    //      callback: callbackFuncion()
    //  }
    //

    let path = params.path;
    let partial = params.partial || "index.html";
    let container = document.querySelector(params.container);
    let insert = params.insert;
    let script = params.script;
    let callback = params.callback;

    // fetch the file path, plus .html
    fetch(path + partial)
        // then convert the response into text
        .then(function (response) {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error("The requested partial at " + path + partial + ".html couldn't be found.");
            }
        })
        // then set the response as the innerHTML of the requested
        // container
        .then(function (html) {
            let markup = document.createRange().createContextualFragment(html);
            if (insert === "prepend" || insert === "append") {
                if (insert === "prepend") {
                    container.prepend(markup);
                } else if (insert === "append") {
                    container.appendChild(markup);
                }
            } else {
                container.innerHTML = "";
                container.appendChild(markup);
            }

            // run the callback
            // check to see if the function is defined
            if (typeof callback === "function") {
                callback(partial);
            }
        })
        // and if there are any problems, warn us
        .catch(function (error) {
            console.warn(error);
        });

    if (script !== undefined) {
        // and finally, if there is a 
        // script to be loaded, load it
        fetch(path + "/" + script + ".js")
            // then convert the response into text
            .then(function (response) {
                if (response.ok) {
                    let head = document.querySelector("head");
                    let oldscript = document.querySelector(".partial-script");
                    let newscript = document.createElement("script");

                    if (oldscript !== null) {
                        oldscript.remove();
                    }

                    newscript.classList.add("partial-script");
                    newscript.src = path + "scripts.js";
                    head.appendChild(newscript);
                } else {
                    throw new Error("The loaded partial does not have a script.");
                }
            })
            // and if there are any problems, warn us
            .catch(function (error) {
                console.warn(error);
            });
    }
}