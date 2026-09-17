import history from "./history.js";

let selectedCell = null;
let notesOn = false; 
const mapOfConflicts = new Map();
const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]
const numberKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

export function resetGameState() {
    selectedCell = null;
    notesOn = false; 
    mapOfConflicts.clear();
    history.clearHistory()
}

document.addEventListener("keydown", (event) => {
    if (!selectedCell) return;
    const { row, column } = selectedCell.dataset;    
    let selectedRow = Number(row);
    let selectedColumn = Number(column);
    switch (event.key) {
        case "ArrowUp":
            selectedRow--;
            break;
        case "ArrowDown":
            selectedRow++;
            break;
        case "ArrowLeft":
            selectedColumn--;
            break;
        case "ArrowRight":
            selectedColumn++;
            break;
    }
    
    if (arrowKeys.includes(event.key)) {
        const nextCell = document.querySelector(`.board-cell[data-row='${selectedRow}'][data-column='${selectedColumn}']`)
        if (nextCell) {
            chooseCell(nextCell)
        }
    }

    if (numberKeys.includes(event.key)) {
        enterNumber(event.key)
    }

    if (event.key === "Backspace" || event.key === "Delete") {
        eraseSelectedCell()
    }
})

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
            const noConflictCell = document.getElementById(conflictedCell);
            noConflictCell.classList.remove("conflict");
            mapOfConflicts.delete(conflictedCell);
        }
    }

    mapOfConflicts.delete(id);
    cell.classList.remove("conflict");
}

export function enterNumber(number) {
    if (!selectedCell || selectedCell.classList.contains("fixed")) {
        return
    } 

    const selectedCellNoteElements = selectedCell.querySelectorAll(".note");
    const selectedCellValueElement = selectedCell.querySelector(".cell-value");

    if (!notesOn) {
        selectedCell.dataset.mode = "value";
        changeCellValue(selectedCell, selectedCellValueElement, selectedCellNoteElements, number)
    } else {
        selectedCell.dataset.mode = "notes";
        changeCellNotes(selectedCell, selectedCellValueElement, selectedCellNoteElements, number)
    }

    highlightCells(selectedCell);
    removeConflicts(selectedCell);
    checkConflicts(selectedCell);
}

function changeCellValue(selectedCell, selectedCellValueElement, selectedCellNoteElements, number) {
    const currentCellNotes = [...selectedCellNoteElements].filter((noteElement) => noteElement.textContent !== "").map((noteElement) => noteElement.textContent);
    const currentCellValue = selectedCellValueElement.textContent;
    const currentData = currentCellNotes.length ? currentCellNotes : currentCellValue;

    if (currentCellNotes.length) {
        for (const note of selectedCellNoteElements) {
            note.textContent = ""
        }
    }

    if (currentCellValue === number) {
        selectedCellValueElement.textContent = "";
        selectedCell.classList.remove("changed");
    } else {
        selectedCellValueElement.textContent = number;
        selectedCell.classList.add("changed");
    }

    const newCellValue = selectedCellValueElement.textContent;
    history.addCellDataToHistory(selectedCell.id, currentData, newCellValue);
}

function changeCellNotes(selectedCell, selectedCellValueElement, selectedCellNoteElements, number) {
    const currentCellNotes = [...selectedCellNoteElements].filter((noteElement) => noteElement.textContent !== "").map((noteElement) => noteElement.textContent);
    const currentCellValue = selectedCellValueElement.textContent;
    const currentData = currentCellValue ? currentCellValue : currentCellNotes;
    let newCellNotes = [...currentCellNotes];
    
    if (currentCellValue) {
        selectedCellValueElement.textContent = "" ;
    }

    const note = [...selectedCellNoteElements].find(note => note.id.split("-")[1] === number)
    if (note.textContent === "") {
        note.textContent = number;
        newCellNotes.push(number);
    } else {
        note.textContent = "";
        newCellNotes = newCellNotes.filter((noteValue) => noteValue !== number);
    }

    history.addCellDataToHistory(selectedCell.id, currentData, newCellNotes);
}

export function eraseSelectedCell() {
    if (!selectedCell || selectedCell.classList.contains("fixed")) {
        return;
    }
    
    const cellMode = selectedCell.dataset.mode;
    const selectedCellValueElement = selectedCell.querySelector(".cell-value");
    const selectedCellNoteElements = selectedCell.querySelectorAll(".note");
    let currentData; 

    if (cellMode === "value") {
        currentData = selectedCellValueElement.textContent;
        if (currentData === "" ) {
            return;
        }
        selectedCellValueElement.textContent = "";
        selectedCell.classList.remove("changed");
        history.addCellDataToHistory(selectedCell.id, currentData, "");
    } else if (cellMode === "notes") {
        currentData = [...selectedCellNoteElements].filter((noteElement) => noteElement.textContent !== "").map((noteElement) => noteElement.textContent)
        if (currentData.length === 0) {
            return;
        }
        for (const note of selectedCellNoteElements) {
            note.textContent = "";
        }
        history.addCellDataToHistory(selectedCell.id, currentData, []);
    }

    highlightCells(selectedCell);
    removeConflicts(selectedCell);
    checkConflicts(selectedCell);
}

export function toggleNotesMode(button) {
    notesOn = !notesOn;
    button.classList.toggle("notes-on");  
}

export function undoOperation() {
    const lastStep = history.pop();
    if (!lastStep) return;

    const cell = document.getElementById(lastStep.cell)
    const noteElements = cell.querySelectorAll(".note");
    const cellValueElement = cell.querySelector(".cell-value");
    const oldData = lastStep.oldData;
    
    if (Array.isArray(oldData)) {
        cellValueElement.textContent = ""
        cell.classList.remove("changed");
        for (const note of noteElements) {
            const noteNumber = note.id.split("-")[1];
            note.textContent = oldData.includes(noteNumber) ? noteNumber : "";
        }
        cell.dataset.mode = "notes";
    } else {
        for (const note of noteElements) {
            note.textContent = "";
        }
        cellValueElement.textContent = oldData
        if (oldData === "") {
            cell.classList.remove("changed");
        } else {
            cell.classList.add("changed");
        }
        cell.dataset.mode = "value";
    }

    chooseCell(cell);
    removeConflicts(cell);
    checkConflicts(cell);
}

