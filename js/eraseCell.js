import { selectedCell } from "./chooseCell.js"
import { addToHistory } from "./history.js";

export function eraseCell(cell) {
    console.log(cell);
    console.log(selectedCell);
    
    if (selectedCell.innerText === "" || selectedCell.classList.contains("fixed")) {
        return;
    }

    const oldValue = selectedCell.innerText;
    selectedCell.innerText = "";
    const newValue = selectedCell.innerText;
    
    addToHistory(selectedCell.id, oldValue, newValue)
}