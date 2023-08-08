function skipToMain() {
    let main = document.querySelector("main");
    main.classList.add("focusable"); // borrows focusable from smoothscroll
    main.focus();
}

addEventDelegate("click", "#skip-to-main", skipToMain);

fetchPartial({
    path: componentPath,
    partial: "skiptomain/_skiptomain.html",
    container: "body",
    insert: "prepend"
});