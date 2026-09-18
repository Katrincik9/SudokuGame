import { pauseIcon, playIcon, undoIcon, eraseIcon, notesIcon } from "./icons.js";
import { eraseSelectedCell, toggleNotesMode, undoOperation, enterNumber } from "./cellOperations.js";
import { createNewGame } from "./gridLayout.js";

let intervalId = null;

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
    timerBtn.innerHTML = pauseIcon + playIcon;
    timerBtn.addEventListener("click", (event) => toggleTimer(event.currentTarget))
    timerSection.appendChild(timerBtn);
}

export function toggleTimer(timer) {
    timer.classList.toggle("paused");  
    const board = document.getElementById("sudoku-board");
    board.classList.toggle("hidden")  
    if (timer.classList.contains("paused")) {
        pauseTime()
    } else {
        incrementTime()
    }
}

function incrementTime() {
    intervalId = setInterval(() => {
    const timerSpan = document.getElementById("timer-span");
    let time = timerSpan.textContent.split(':');
    let minutes = Number(time[0]);
    let seconds = Number(time[1]);
    seconds++;
    if (seconds > 59) {
        minutes++;
        seconds = 0; 
    }

    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    time = minutes + ":" + seconds;
    timerSpan.textContent = time;
}, 1000)
}

function pauseTime() {
    clearInterval(intervalId);
    intervalId = null;
}

export function startNewTime() {
    pauseTime()
    const timerSpan = document.getElementById("timer-span");
    timerSpan.textContent = "00:00"
    const board = document.getElementById("sudoku-board");
    board.classList.remove("hidden");
    const timerBtn = document.getElementById("timer-button");
    timerBtn.classList.remove("paused")
    incrementTime()
}

const buttons = [
    {
        id: "undo-button",
        icon: undoIcon,
        function: undoOperation,
    },
    {
        id: "erase-button",
        icon: eraseIcon,
        function: eraseSelectedCell,
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
    numpad.addEventListener("click", (event) => {
        if (!event.target.classList.contains("numpad-item")) {
            return;
        }
        const number = event.target.id.split("-")[1];
        enterNumber(number);
    }) 
    controlsButtons.appendChild(numpad);

    for (let index=1; index<=9; index++){
        const numpadItem = document.createElement("button");
        numpadItem.classList.add("numpad-item");
        numpadItem.id = "numpad-" + index;
        numpadItem.innerText = index;
        numpad.append(numpadItem);
    }
}

function createNewGameButton(controlsButtons) {
    const newGameBtn = document.createElement("button");
    newGameBtn.id = "new-game-button";
    newGameBtn.innerText = "New Game";
    newGameBtn.addEventListener("click", (event) => {createNewGame(event.target)})
    controlsButtons.appendChild(newGameBtn);
}



