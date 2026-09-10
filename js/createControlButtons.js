import { pauseIcon, undoIcon, eraseIcon, notesIcon } from "./icons.js";
import { eraseCell, toggleNotesMode, undoStep, chooseNumber } from "./changeCell.js";

export function createControlButtons(app) {
    const controlsButtons = document.createElement("div");
    controlsButtons.id = "controls-buttons";
    app.appendChild(controlsButtons);

    createTimer(controlsButtons);
    createActionButtons(controlsButtons);
    createNumpad(controlsButtons);
    createNewGameButton(controlsButtons);
}

function createTimer(controlsButtons) {
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

const buttons = [
    {
        id: "undo-button",
        icon: undoIcon,
        function: undoStep,
    },
    {
        id: "erase-button",
        icon: eraseIcon,
        function: eraseCell,
    },
    {
        id: "notes-button",
        icon: notesIcon,
        function: toggleNotesMode,
    }
];

function createActionButtons(controlsButtons) {
    const gameControlsButtons = document.createElement("div");
    gameControlsButtons.id = "game-control-buttons";
    controlsButtons.appendChild(gameControlsButtons);

    buttons.forEach((button) => {
        const actionBtn = createButton(button.id, button.icon);
        actionBtn.addEventListener("click", (event) => {button.function(event.currentTarget)})
        gameControlsButtons.appendChild(actionBtn);
    });
}

function createButton(id, icon) {
    const button = document.createElement("button");
    button.id = id;
    button.classList.add("game-control-button");
    button.innerHTML = icon;

    return button;
}

function createNumpad(controlsButtons) {
    const numpad = document.createElement("div");
    numpad.id = "numpad";
    numpad.addEventListener("click", (event) => {chooseNumber(event.target)}) 
    controlsButtons.appendChild(numpad);

    for (let index=0; index<9; index++){
        const numpadItem = document.createElement("button");
        numpadItem.classList.add("numpad-item");
        numpadItem.id = index + 1;
        numpadItem.innerText = index + 1;
        numpad.append(numpadItem);
    }
}

function createNewGameButton(controlsButtons) {
    const newGameBtn = document.createElement("button");
    newGameBtn.id = "new-game-button";
    newGameBtn.innerText = "New Game";
    controlsButtons.appendChild(newGameBtn);
}



