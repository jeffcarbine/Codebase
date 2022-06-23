/////////
// SOCIAL
/////////
// handles all the api requests for facebook,
// instagram, twitter and youtube


// FACEBOOK
function facebook(params) {
    let appId = params.appId,
        pageId = params.pageId;

    if (!document.getElementById("fb-root")) {
        // create div required for fb
        const fbDiv = document.createElement("div");
        fbDiv.id = "fb-root";
        document.body.appendChild(fbDiv);
        // Run any script after sdk is loaded
        window.fbAsyncInit = function () {
            FB.api(
                "/" + pageId + "/posts",
                function (response) {
                    if (response && !response.error) {
                        // handle the response
                    } else {
                        console.warn(response);
                    }
                }
            );
        };
        // inject sdk.js
        (function (d, script) {
            script = d.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src =
                "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v5.0&appId=" +
                appId +
                "&autoLogAppEvents=1";
            d.getElementsByTagName("head")[0].appendChild(script);
        })(document);
    }
}


// TWITTER
