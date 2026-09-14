import { chooseCell } from "./changeCell.js";

function generatePuzzle() {
    const generatedPuzzle = window.sudoku.generate("easy");
    const generatedPuzzleGrid = window.sudoku.board_string_to_grid(generatedPuzzle);

    return generatedPuzzleGrid
}

export function createGrid(app) {
    const board = createBoard();
    const newPuzzle = generatePuzzle();
    app.appendChild(board);

    for (let row=0; row<9; row++) {
        for (let column=0; column<9; column++) {
            const cell = createCell(row, column, newPuzzle[row][column]);
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

function createCell(row, column, puzzleValue) {
    const cell = document.createElement("div");
    cell.classList.add("board-cell");
    cell.dataset.row = row;
    cell.dataset.column = column;
    cell.dataset.box = Math.floor(row / 3) * 3 + Math.floor(column / 3);
    cell.id = cell.dataset.row + cell.dataset.column;
    
    const value = document.createElement("div");
    value.classList.add("cell-value");
    cell.appendChild(value);
    
    if (puzzleValue !== ".") {
        value.textContent = puzzleValue;
        cell.classList.add("fixed");
    } else {
        const notes = createNotes(cell) 
    }

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

