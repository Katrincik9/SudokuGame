import { chooseCell } from "./cellOperations.js";
import { resetGameState } from "./cellOperations.js";

function generatePuzzle() {
    const generatedPuzzle = window.sudoku.generate("easy");
    const generatedPuzzleGrid = window.sudoku.board_string_to_grid(generatedPuzzle);

    return generatedPuzzleGrid
}

export function createNewGame() {
    const cells = document.querySelectorAll(".board-cell")
    const newPuzzle = generatePuzzle();
    for (const cell of cells) {
        resetCellState(cell)
        populateCellWithPuzzle(cell, newPuzzle)
    } 
    resetGameState()
    chooseCell(cells[0])
}

function resetCellState(cell) {
    cell.classList.remove("fixed", "same-value", "highlighted", "selected", "conflict", "changed")
    const cellValue = cell.querySelector(".cell-value")
    cellValue.textContent = ""
    const cellNotes = cell.querySelectorAll(".note")
    for (const note of cellNotes) {
        note.textContent = ""
    }
}

function populateCellWithPuzzle(cell, newPuzzle) {
    const row = cell.dataset.row
    const column = cell.dataset.column
    const cellValue = cell.querySelector(".cell-value")
    const puzzleValue = newPuzzle[row][column]
    if (puzzleValue !== ".") {
        cellValue.textContent = puzzleValue
        cell.classList.add("fixed");
    }
}

export function createGrid(app) {
    const board = createBoard();
    app.appendChild(board);

    for (let row=0; row<9; row++) {
        for (let column=0; column<9; column++) {
            const cell = createCell(row, column);
            board.appendChild(cell);
        }
    }
}

function createBoard() {
    const board = document.createElement("div");
    board.id = "sudoku-board";
    board.addEventListener("click", (event) => chooseCell(event.target))

    return board
}

function createCell(row, column) {
    const cell = document.createElement("div");
    cell.classList.add("board-cell");
    cell.dataset.row = row;
    cell.dataset.column = column;
    cell.dataset.box = Math.floor(row / 3) * 3 + Math.floor(column / 3);
    cell.id = cell.dataset.row + cell.dataset.column;
    
    const value = document.createElement("div");
    value.classList.add("cell-value");
    cell.appendChild(value);
    createNotes(cell) 

    return cell;
}

function createNotes(cell) {
    const notes = document.createElement("div");
    notes.classList.add("cell-notes");

    for (let index=1; index<=9; index++) {
        const note = document.createElement("span");
        note.id = cell.id + "-" + index;
        note.classList.add("note");
        notes.appendChild(note);
    }

    cell.appendChild(notes);

    return notes
}

