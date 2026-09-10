import { addValueToHistory, addNotesToHistory} from "./history.js";

let selectedCell = null;
let notesOn = false; 

export function chooseCell(cell) {
    let cells = document.querySelectorAll(".board-cell")
    cells.forEach((cell) => {
        cell.classList.remove("highlighted")
    })

    if (!cell.classList.contains("board-cell")) {
        return;
    }

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
    let boxRow = Math.floor(selectedRow / 3) * 3
    let boxColumn = Math.floor(selectedColumn / 3) * 3

    cells.forEach((cell) => {
        let currentRow = cell.id[0]
        let currentColumn = cell.id[1]

        if (currentRow === selectedRow || currentColumn === selectedColumn) {
            cell.classList.add("highlighted")
        }

        if (currentRow >= boxRow && currentRow < boxRow + 3 && currentColumn >= boxColumn && currentColumn < boxColumn + 3) {
            cell.classList.add("highlighted")
        }
    })
}

export function chooseNumber(button) {
    if (!button.classList.contains("numpad-item") || !selectedCell || selectedCell.classList.contains("fixed")) {
        return
    } 

    const number = button.id; 
    const notes = selectedCell.querySelectorAll(".note");
    const cellNotes = selectedCell.querySelector(".notes");
    const cellValue = selectedCell.querySelector(".cell-value");

    if (!notesOn) {
        if (cellValue.textContent === number) {
            updateCellValue(selectedCell, cellValue, "")
        } else {
            cellValue.classList.remove("no-display")
            cellNotes.classList.add("no-display");
            updateCellNotes(selectedCell, notes, "")
            updateCellValue(selectedCell, cellValue, number)
        }
    } else {
        cellValue.classList.add("no-display");
        updateCellValue(selectedCell, cellValue, "")
        cellNotes.classList.remove("no-display");
        updateCellNotes(selectedCell, notes, number) 
    }
}

function updateCellValue(cell, cellValue, newValue) {
    const oldValue = cellValue.textContent;
    cellValue.textContent = newValue;
    if (newValue === "") {
        cellValue.classList.remove("changed")
    } else {
        cellValue.classList.add("changed")
    }
    
    addValueToHistory(cell.id, oldValue, newValue)
}

function updateCellNotes(cell, notes, clickedNumber) {
    let oldNotes = []
    notes.forEach((note) => {
        if (note.textContent !== "") oldNotes.push(note.textContent)
    })
    let newNotes = [...oldNotes]
    console.log(clickedNumber)
        notes.forEach((note) => {
            if (clickedNumber === "") {
                newNotes = []
                note.textContent = ""
            } else {
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
        })

    addNotesToHistory(cell.id, oldNotes, newNotes)
}

export function eraseCell() {
    if (!selectedCell || selectedCell.textContent === "" || selectedCell.classList.contains("fixed")) {
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
    
}