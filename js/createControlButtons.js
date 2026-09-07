import { createActionButtons } from "./createActionButtons.js";
import { createNumpad } from "./createNumpad.js";
import { createTimer } from "./createTimer.js";
import { createNewGameButton } from "./createNewGameButton.js";

export function createControlButtons(app) {
    const controlsButtons = document.createElement("div");
    controlsButtons.id = "controls-buttons";
    app.appendChild(controlsButtons);

    createTimer(controlsButtons);
    createActionButtons(controlsButtons);
    createNumpad(controlsButtons);
    createNewGameButton(controlsButtons);
}