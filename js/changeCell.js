import { addToHistory } from "./history.js";

let selectedCell = null;
let selectedButton = null;

export function chooseCell(cell) {
    if (selectedCell !== null) {
        selectedCell.classList.remove("selected");
    } 

    selectedCell = cell;
    selectedCell.classList.add("selected");
}

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

export function toggleNotes() {
    
}

export function undoStep() {
    
}
