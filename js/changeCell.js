import { addToHistory } from "./history.js";

let selectedCell = null;
let selectedButton = null;

export function chooseCell(cell) {
    let cells = document.querySelectorAll(".board-cell")
    cells.forEach((cell) => {
        cell.classList.remove("highlighted")
    })

    if (selectedCell !== null) {
        selectedCell.classList.remove("selected");
    }

    selectedCell = cell;
    selectedCell.classList.add("selected");
    highlightCells(cells, selectedCell);
}  

function highlightCells(cells, selectedCell) {
    let id = selectedCell.id.split("")
    let selectedRow = id[0]
    let selectedColumn = id[1]
    let startRow = Math.floor(selectedRow / 3) * 3    
    let startColumn = Math.floor(selectedColumn / 3) * 3

    cells.forEach((cell) => {
        let currentRow = cell.id[0]
        let currentColumn = cell.id[1]

        if (currentRow === selectedRow || currentColumn === selectedColumn) {
            cell.classList.add("highlighted")
        }

        if (currentRow >= startRow && currentRow < startRow + 3 && currentColumn >= startColumn && currentColumn < startColumn + 3) {
            cell.classList.add("highlighted")
        }
    })
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