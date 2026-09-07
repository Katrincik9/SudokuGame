import { selectedCell } from "./chooseCell.js";
import { addToHistory } from "./history.js";

export let selectedButton = null;

export function chooseNumber(button) {
    selectedButton = button.id; 

    if (selectedCell.classList.contains("fixed")) {
        return; 
    } else {
        const oldValue = selectedCell.innerText;
        selectedCell.innerText = selectedButton;
        const newValue = selectedCell.innerText;
        
        addToHistory(selectedCell.id, oldValue, newValue)
    }
}
