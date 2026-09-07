import { pauseIcon } from "./icons.js";

export function createTimer(controlsButtons) {
    const timerSection = document.createElement("div");
    timerSection.id = "timer-section";
    controlsButtons.appendChild(timerSection);

    createTimerDisplay(timerSection);
    createTimerButton(timerSection);
}

function createTimerDisplay(timerSection) {
    const timerText = document.createElement("div");
    timerText.id = "timer-text";
    timerSection.appendChild(timerText);

    const timerLabel = document.createElement("label");
    timerLabel.id = "timer-label";
    timerLabel.innerText = "Time"
    timerText.appendChild(timerLabel);

    const timerSpan = document.createElement("span")
    timerSpan.id = "timer-span";
    timerSpan.innerText = "00:00"
    timerText.appendChild(timerSpan);
}

function createTimerButton(timerSection) {
    const timerBtn = document.createElement("button");
    timerBtn.id = "timer-button";
    timerBtn.innerHTML = pauseIcon;
    timerSection.appendChild(timerBtn);
}