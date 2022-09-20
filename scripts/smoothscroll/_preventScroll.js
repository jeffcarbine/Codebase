// if we detect a location hash on load, we prevent
// the default behavior
if (location.hash) {
  // use settimeout to interrupt the default behavior at 1ms
  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 1);

  // // smooth scroll at 10ms
  // setTimeout(function () {
  //   smoothScroll(location.hash);
  // }, 10);
}
