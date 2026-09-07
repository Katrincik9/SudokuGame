export function createNewGameButton(controlsButtons) {
    const newGameBtn = document.createElement("button");
    newGameBtn.id = "new-game-button";
    newGameBtn.innerText = "New Game";
    controlsButtons.appendChild(newGameBtn);
}