import { addValueToHistory, addNotesToHistory} from "./history.js";

let selectedCell = null;
let notesOn = false; 

export function chooseCell(cell) {
    const cells = document.querySelectorAll(".board-cell")
    cells.forEach((cell) => {
        cell.classList.remove("same-cell", "highlighted")
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
    const selectedRow = selectedCell.dataset.row
    const selectedColumn = selectedCell.dataset.column
    const selectedBoxRow = Math.floor(selectedRow / 3)
    const selectedBoxColumn = Math.floor(selectedColumn / 3)

    for (const cell of cells) {
        cell.classList.remove("same-cell", "highlighted")
        
        const currentCellValue = cell.querySelector(".cell-value").textContent;
        const currentRow = cell.dataset.row
        const currentColumn = cell.dataset.column
        const currentBoxRow = Math.floor(currentRow / 3)
        const currentBoxColumn = Math.floor(currentColumn / 3)

        if (selectedCellValue === currentCellValue && selectedCellValue !== "") {
            cell.classList.add("same-cell")
        }

        if (currentRow === selectedRow || currentColumn === selectedColumn || 
            (currentBoxRow === selectedBoxRow && currentBoxColumn === selectedBoxColumn )) {
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
    const cells = document.querySelectorAll(".board-cell")

    if (!notesOn) {
        enterCellValue(selectedCell, cellValue, notes, number)
    } else {
        enterCellNotes(selectedCell, cellValue, notes, number)
    }

    highlightCells(cells, selectedCell)
}

function enterCellValue(selectedCell, cellValue, notes, number) {
    for (const note of notes) {
        if (note.textContent !== "") note.textContent = ""
    }
    selectedCell.dataset.mode = "value"
    if (cellValue.textContent === number) {
        updateCellValue(selectedCell, cellValue, "")
    } else {
        updateCellValue(selectedCell, cellValue, number)
    }
}

function enterCellNotes(selectedCell, cellValue, notes, number) {
    cellValue.textContent = "";
    selectedCell.dataset.mode = "notes"
    updateCellNotes(selectedCell, notes, number)
}

function updateCellValue(cell, cellValue, newValue) {
    const id = cell.dataset.row + cell.dataset.column
    const oldValue = cellValue.textContent;
    cellValue.textContent = newValue;
    if (newValue === "") {
        cell.classList.remove("changed")
    } else {
        cell.classList.add("changed")
    }
    
    addValueToHistory(id, oldValue, newValue)
}

function updateCellNotes(cell, notes, clickedNumber) {
    const id = cell.dataset.row + cell.dataset.column
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
    addNotesToHistory(id, oldNotes, newNotes)
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