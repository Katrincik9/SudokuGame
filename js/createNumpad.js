import { chooseNumber } from "./chooseNumber.js";

export function createNumpad(controlsButtons) {
    const numpad = document.createElement("div");
    numpad.id = "numpad";
    controlsButtons.appendChild(numpad);

    for (let index=0; index<9; index++){
        const numpadItem = document.createElement("button");
        numpadItem.classList.add("numpad-item");
        numpadItem.id = index + 1;
        numpadItem.innerText = index + 1;
        numpadItem.addEventListener("click", (event) => {chooseNumber(event.target)})
        numpad.append(numpadItem);
    }
}



