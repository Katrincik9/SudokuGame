import { undoIcon, eraseIcon, notesIcon } from "./icons.js";

const buttons = [
    {
        id: "undo-button",
        icon: undoIcon,
    },
    {
        id: "erase-button",
        icon: eraseIcon,
    },
    {
        id: "notes-button",
        icon: notesIcon,
    }
];

export function createActionButtons(controlsButtons) {
    const gameControlsButtons = document.createElement("div");
    gameControlsButtons.id = "game-control-buttons";
    controlsButtons.appendChild(gameControlsButtons);

    buttons.forEach((button) => {
        const actionBtn = createButton(button.id, button.icon);
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