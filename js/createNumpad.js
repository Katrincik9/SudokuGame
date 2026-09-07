export function createNumpad(controlsButtons) {
    const numpad = document.createElement("div");
    numpad.id = "numpad";
    controlsButtons.appendChild(numpad);

    for (let index=0; index<9; index++){
        const numpadItem = document.createElement("button");
        numpadItem.classList.add("numpad-item");
        numpadItem.id = index;
        numpadItem.innerText = index + 1;
        numpad.append(numpadItem);
    }
}