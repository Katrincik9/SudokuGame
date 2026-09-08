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

    if (!selectedCell || selectedCell.classList.contains("fixed")) {
        return; 
    } else if (selectedCell.innerText === selectedButton) {
        updateCell(selectedCell, "")
    } else {
        updateCell(selectedCell, selectedButton)
    }
}

function updateCell(cell, newValue) {
    const oldValue = cell.innerText;
    cell.innerText = newValue;
    if (newValue === "") {
        cell.classList.remove("changed")
    } else {
        cell.classList.add("changed")
    }
    addToHistory(cell.id, oldValue, newValue)
}

export function eraseCell() {
    if (!selectedCell || selectedCell.innerText === "" || selectedCell.classList.contains("fixed")) {
        return;
    }

    updateCell(selectedCell, "")
}

export function toggleNotes() {
    
}

export function undoStep() {
    
}