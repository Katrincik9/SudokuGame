import { selectedCell } from "./chooseCell.js";

export let selectedButton = null;

export function chooseNumber(button) {
    selectedButton = button.id; 
    
    if (selectedCell.classList.contains("fixed")) {
        return; 
    } else {
        selectedCell.innerText = selectedButton;
    }
}
