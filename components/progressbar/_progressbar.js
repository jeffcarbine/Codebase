// PROGRESS BAR

function progress(progressBar, advance) {
    // first, check to see if we are
    // advancing or not
    if (advance === true) {
        let nextStep = progressBar.querySelector("li:not(.completed)");
        if (nextStep !== null) {
            nextStep.classList.add("completed");
        }
    } else {
        let lastSteps = progressBar.querySelectorAll("li.completed");
        if (lastSteps !== null) {
            lastStep = lastSteps[lastSteps.length - 1];
            lastStep.classList.remove("completed");
        }
    }
}