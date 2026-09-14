import { addValueToHistory, addNotesToHistory, removeLastHistory } from "./history.js";

let selectedCell = null;
let notesOn = false; 

export function chooseCell(cell) {
    if (!cell.classList.contains("board-cell")) {
        return;
    }

    if (selectedCell !== null) {
        selectedCell.classList.remove("selected");
    }

    selectedCell = cell;
    selectedCell.classList.add("selected");
    highlightCells(selectedCell);
}  

function highlightCells(selectedCell) {
    const selectedCellValue = selectedCell.querySelector(".cell-value").textContent;
    const { row : selectedRow, column : selectedColumn, box : selectedBox} = selectedCell.dataset;
    const cells = document.querySelectorAll(".board-cell")

    for (const cell of cells) {
        cell.classList.remove("same-value", "highlighted")
        const currentCellValue = cell.querySelector(".cell-value").textContent;
        const { row : currentRow, column : currentColumn, box : currentBox } = cell.dataset;

        if (selectedCellValue === currentCellValue && selectedCellValue !== "") {
            cell.classList.add("same-value")
        }

        if (currentRow === selectedRow || currentColumn === selectedColumn || currentBox === selectedBox) {
            cell.classList.add("highlighted")
        }
    }
}

export function chooseNumber(button) {
    if (!button.classList.contains("numpad-item") || !selectedCell || selectedCell.classList.contains("fixed")) {
        return
    } 

    const number = button.id; 
    const notes = selectedCell.querySelectorAll(".note");
    const cellValue = selectedCell.querySelector(".cell-value");

    if (!notesOn) {
        enterCellValue(selectedCell, cellValue, number)
    } else {
        enterCellNotes(selectedCell, notes, number)
    }

    highlightCells(selectedCell)
}

function enterCellValue(selectedCell, cellValue, number) {
    selectedCell.dataset.mode = "value"
    if (cellValue.textContent === number) {
        updateCellValue(selectedCell, cellValue, "")
    } else {
        updateCellValue(selectedCell, cellValue, number)
    }
}

function enterCellNotes(selectedCell, notes, number) {
    selectedCell.dataset.mode = "notes"
    updateCellNotes(selectedCell, notes, number)
}

function updateCellValue(cell, cellValue, newValue) {
    const oldValue = cellValue.textContent;
    cellValue.textContent = newValue;
    if (newValue === "") {
        cell.classList.remove("changed")
    } else {
        cell.classList.add("changed")
    }
    
    addValueToHistory(cell.dataset.id, oldValue, newValue)
}

function updateCellNotes(cell, notes, clickedNumber) {
    const oldNotes = [...notes].filter((note) => note.textContent !== "").map((note) => note.textContent)
    let newNotes = [...oldNotes]
    for (const note of notes) {
        if (clickedNumber === "") {
            newNotes = []
            note.textContent = ""
            continue;
        }
        
        if (note.id === clickedNumber) {
            if (note.textContent === "") {
                note.textContent = clickedNumber
                newNotes.push(note.textContent)
            } else {
                newNotes = newNotes.filter((note) => note !== clickedNumber)
                note.textContent = ""
            }
        }
    }

    if (oldNotes.length === newNotes.length) return;
    addNotesToHistory(cell.dataset.id, oldNotes, newNotes)
}

export function eraseCell() {
    if (!selectedCell || selectedCell.classList.contains("fixed")) {
        return;
    }
    
    const valueElement = selectedCell.querySelector(".cell-value");
    const notes = selectedCell.querySelectorAll(".note");

    if (valueElement.textContent !== "") {
        updateCellValue(selectedCell, valueElement, "");
        return;
    }

    updateCellNotes(selectedCell, notes, "")
}

export function toggleNotesMode(button) {
    notesOn = !notesOn;
    button.classList.toggle("notes-on");  
}

export function undoStep() {
    const lastStep = removeLastHistory();
    if (!lastStep) return;
    const lastStepCellId = lastStep.cell;
    const cell = document.querySelector(`.board-cell[data-id='${lastStepCellId}']`)
    
    if ("oldNotes" in lastStep) {
        undoNotes(lastStep, cell)
    }

    if ("oldValue" in lastStep) {  
        undoValue(lastStep, cell) 
    }
}

function undoNotes(lastStep, cell) {
    const lastStepNotes = lastStep.oldNotes;
    const notes = cell.querySelectorAll(".note");
    for (const note of notes) {
        note.textContent = lastStepNotes.includes(note.id) ? note.id : "";
    }
    cell.dataset.mode = "notes" 
    chooseCell(cell);

    const isEmpty = lastStep.oldNotes.length === 0;
    if (isEmpty) {
        cell.dataset.mode = "value"    
    }
}

function undoValue(lastStep, cell) {
    const lastStepValue = lastStep.oldValue;
    const cellValue = cell.querySelector(".cell-value");
    cellValue.textContent = lastStepValue;
    cell.dataset.mode = "value"
    chooseCell(cell);

    const isEmpty = lastStep.oldValue === "";
    if (isEmpty) {
        cell.dataset.mode = "notes"
    }
}
