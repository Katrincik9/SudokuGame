import { addValueToHistory, addNotesToHistory} from "./history.js";

let selectedCell = null;
let notesOn = false; 

export function chooseCell(cell) {
    let cells = document.querySelectorAll(".board-cell")
    cells.forEach((cell) => {
        cell.classList.remove("highlighted")
        cell.classList.remove("same-cell")
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
    const selectedCellValue = selectedCell.querySelector(".cell-value").textContent;
    const id = selectedCell.id.split("")
    const selectedRow = id[0]
    const selectedColumn = id[1]
    const selectedBoxRow = Math.floor(selectedRow / 3) * 3
    const selectedBoxColumn = Math.floor(selectedColumn / 3) * 3

    cells.forEach((cell) => {
        const currentCellValue = cell.querySelector(".cell-value").textContent;
        const currentRow = cell.id[0]
        const currentColumn = cell.id[1]

        if (selectedCellValue === currentCellValue && selectedCellValue !== "") {
            cell.classList.add("same-cell")
        }

        if (currentRow === selectedRow || currentColumn === selectedColumn) {
            cell.classList.add("highlighted")
        }

        if (currentRow >= selectedBoxRow && currentRow < selectedBoxRow + 3 && currentColumn >= selectedBoxColumn && currentColumn < selectedBoxColumn + 3) {
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
    if (oldValue === newValue) return;
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

    if (oldNotes.length === newNotes.length) return;
    addNotesToHistory(cell.id, oldNotes, newNotes)
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
    
}