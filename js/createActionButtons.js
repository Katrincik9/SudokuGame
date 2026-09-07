import { undoIcon, eraseIcon, notesIcon } from "./icons.js";
import { eraseCell } from "./eraseCell.js";
import { toggleNotes } from "./toggleNotes.js";
import { undoStep } from "./undoStep.js";

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
        function: toggleNotes,
    }
];

export function createActionButtons(controlsButtons) {
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