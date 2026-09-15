import { addValueToHistory, addNotesToHistory, removeLastHistory, getLastHistory } from "./history.js";

let selectedCell = null;
let notesOn = false; 
const mapOfConflicts = new Map();

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

function checkConflicts(selectedCell) {
    const changedCellValue = selectedCell.querySelector(".cell-value").textContent;
    const { row, column, box } = selectedCell.dataset;
    const rowCells = document.querySelectorAll(`.board-cell[data-row='${row}']`);
    const columnCells = document.querySelectorAll(`.board-cell[data-column='${column}']`);
    const boxCells = document.querySelectorAll(`.board-cell[data-box='${box}']`);
    const setOfCells = new Set([...rowCells, ...columnCells, ...boxCells]);

    for (const cell of setOfCells) {
        const cellValue = cell.querySelector(".cell-value").textContent;
        if (cellValue === changedCellValue && cell !== selectedCell && cellValue !== "") {
            mapConflicts(selectedCell, cell);
            cell.classList.add("conflict");
            selectedCell.classList.add("conflict");
        }
    }
}

function mapConflicts(firstCell, secondCell) {
    const firstCellId = firstCell.id;
    const secondCellId = secondCell.id;

    if (!mapOfConflicts.has(firstCellId)) {
        mapOfConflicts.set(firstCellId, []);
    }

    if (!mapOfConflicts.has(secondCellId)) {
        mapOfConflicts.set(secondCellId, []);
    }

    if (!mapOfConflicts.get(firstCellId).includes(secondCellId)) {
        mapOfConflicts.get(firstCellId).push(secondCellId);
    }

    if (!mapOfConflicts.get(secondCellId).includes(firstCellId)) {
        mapOfConflicts.get(secondCellId).push(firstCellId);
    }
}

function removeConflicts(cell) {    
    const id = cell.id;
    const cellsInConflicts = mapOfConflicts.get(id);
    if (!cellsInConflicts) {
        return;
    }

    for (let conflictedCell of cellsInConflicts) {
        const conflicts = mapOfConflicts.get(conflictedCell);
        if (conflicts.includes(id)) {
            conflicts.splice(conflicts.indexOf(id), 1);
        } 

        if (conflicts.length === 0) {
            const noConflictCell = document.getElementById(`${conflictedCell}`);
            noConflictCell.classList.remove("conflict");
            mapOfConflicts.delete(conflictedCell);
        }
    }

    mapOfConflicts.delete(id);
    cell.classList.remove("conflict");
}


export function chooseNumber(button) {
    if (!button.classList.contains("numpad-item") || !selectedCell || selectedCell.classList.contains("fixed")) {
        return
    } 

    const number = button.id.split("-")[1]; 
    const selectedCellNotesElement = selectedCell.querySelectorAll(".note");
    const selectedCellValueElement = selectedCell.querySelector(".cell-value");

    if (!notesOn) {
        for (const note of selectedCellNotesElement) {
            note.textContent = ""
        }
        enterCellValue(selectedCell, selectedCellValueElement, number)
    } else {
        selectedCellValueElement.textContent = ""
        enterCellNotes(selectedCell, selectedCellNotesElement, number)
    }

    highlightCells(selectedCell)
}

function enterCellValue(selectedCell, selectedCellValueElement, number) {
    selectedCell.dataset.mode = "value";
    const currentCellValue  = selectedCellValueElement.textContent;

    if (currentCellValue === number) {
        selectedCellValueElement.textContent = "";
        selectedCell.classList.remove("changed");
    } else {
        selectedCellValueElement.textContent = number;
        selectedCell.classList.add("changed");
    }

    const updatedCellValue = selectedCellValueElement.textContent
    
    removeConflicts(selectedCell);
    checkConflicts(selectedCell);
    addValueToHistory(selectedCell.id, currentCellValue, updatedCellValue)
}

function enterCellNotes(selectedCell, selectedCellNotesElement, number) {
    selectedCell.dataset.mode = "notes"
    const currentCellNotes = [...selectedCellNotesElement].filter((noteElement) => noteElement.textContent !== "").map((noteElement) => noteElement.textContent)
    let updatedCellNotes = [...currentCellNotes]
    for (const note of selectedCellNotesElement) {
        if (number === "") {
            updatedCellNotes = []
            note.textContent = ""
            continue;
        }
        
        const noteNumber = note.id.split("-")[1];
        if (noteNumber === number) {
            if (note.textContent === "") {
                note.textContent = number
                updatedCellNotes.push(note.textContent)
            } else {
                updatedCellNotes = updatedCellNotes.filter((noteValue) => noteValue !== number)
                note.textContent = ""
            }
        }
    }

    removeConflicts(selectedCell);
    checkConflicts(selectedCell);
    if (currentCellNotes.length === updatedCellNotes.length) return;
    addNotesToHistory(selectedCell.id, currentCellNotes, updatedCellNotes)
}

export function eraseCell() {
    if (!selectedCell || selectedCell.classList.contains("fixed")) {
        return;
    }
    
    const cellMode = selectedCell.dataset.mode
    const selectedCellValueElement = selectedCell.querySelector(".cell-value");
    const selectedCellNotesElement = selectedCell.querySelectorAll(".note");

    if (cellMode === "value") {
        enterCellValue(selectedCell, selectedCellValueElement, "")
    } else if (cellMode === "notes") {
        enterCellNotes(selectedCell, selectedCellNotesElement, "")
    }

    highlightCells(selectedCell)
    removeConflicts(selectedCell);
    checkConflicts(selectedCell);
}

export function toggleNotesMode(button) {
    notesOn = !notesOn;
    button.classList.toggle("notes-on");  
}

export function undoStep() {
    const lastStep = removeLastHistory();
    if (!lastStep) return;
    const cell = document.getElementById(`${lastStep.cell}`)
    
    if (lastStep.mode === "notes") {
        undoNotes(lastStep, cell);
    } else if (lastStep.mode === "value") {
        undoValue(lastStep, cell);
    }
}

function undoNotes(lastStep, cell) {
    const previousNotes = lastStep.oldNotes;
    const noteElements = cell.querySelectorAll(".note");
    const cellValueElement = cell.querySelector(".cell-value");

    for (const note of noteElements) {
        const noteNumber = note.id.split("-")[1];
        note.textContent = previousNotes.includes(noteNumber) ? noteNumber : "";
    }

    if (previousNotes.length > 0) {
        cell.dataset.mode = "notes";
    } else  {
        const previousStep = getLastHistory()

        if (previousStep && previousStep.cell === lastStep.cell && previousStep.mode === "value") {
            const previousStepValue = previousStep.newValue
            cellValueElement.textContent = previousStepValue;
            cell.dataset.mode = "value"

            if (previousStepValue === "") {
                cell.classList.remove("changed");
            } else {
                cell.classList.add("changed");
            }
        }
        
    }

    chooseCell(cell);
    removeConflicts(cell);
    checkConflicts(cell);
}

function undoValue(lastStep, cell) {
    const previousValue = lastStep.oldValue;
    const cellValueElement = cell.querySelector(".cell-value");
    const noteElements = cell.querySelectorAll(".note");

    cellValueElement.textContent = previousValue;
    if (previousValue === "") {
        cell.classList.remove("changed");

        const previousStep = getLastHistory()

        if (previousStep && previousStep.cell === lastStep.cell && previousStep.mode === "notes") {
            const previousStepNotes = previousStep.newNotes
            for (const note of noteElements) {
                const noteNumber = note.id.split("-")[1];
                note.textContent = previousStepNotes.includes(noteNumber) ? noteNumber : "";
            }
            cell.dataset.mode = "notes"
        } 
    } else {
        cell.dataset.mode = "value";
        cell.classList.add("changed");
    }

    chooseCell(cell);
    removeConflicts(cell);
    checkConflicts(cell);
}

