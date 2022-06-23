//////////
// TOOLTIP
//////////

function generateTooltips() {
    let tooltips = [].slice.call(document.querySelectorAll("span.tooltip"));

    tooltips.forEach(function (tooltip) {
        let tipText = tooltip.dataset.tooltip;

        let text = document.createElement("span");
        text.classList.add("text");
        text.textContent = tipText;
        tooltip.appendChild(text);
    });
}

addEventDelegate("load", window, generateTooltips);