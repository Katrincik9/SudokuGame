import { chooseCell } from "./cellOperations.js";
import { resetGameState } from "./cellOperations.js";
import { pauseIconBoard } from "./icons.js";
import { toggleTimer } from "./controlsLayout.js";
import { resetTimer } from "./controlsLayout.js";

window.testPuzzle = false;

function generatePuzzle() {
    if (!window.testPuzzle) {
        const generatedPuzzle = window.sudoku.generate("easy");
        const generatedPuzzleGrid = window.sudoku.board_string_to_grid(generatedPuzzle);
        return generatedPuzzleGrid
    } else {
        return [
            [".", "3", "4", "6", "7", "8", "9", "1", "2"],
            ["6", "7", "2", "1", "9", "5", "3", "4", "8"],
            ["1", "9", "8", "3", "4", "2", "5", "6", "7"],
            ["8", "5", "9", "7", "6", "1", "4", "2", "3"],
            ["4", "2", "6", "8", "5", "3", "7", "9", "1"],
            ["7", "1", "3", "9", "2", "4", "8", "5", "6"],
            ["9", "6", "1", "5", "3", "7", "2", "8", "4"],
            ["2", "8", "7", "4", "1", "9", "6", "3", "5"],
            ["3", "4", "5", "2", "8", "6", "1", "7", "9"]
        ]; 
    }
}

export function createNewGame() {
    const app = document.getElementById("app");
    app.classList.remove("game-won");
    const cells = document.querySelectorAll(".board-cell")
    const newPuzzle = generatePuzzle();
    for (const cell of cells) {
        resetCellState(cell)
        populateCellWithPuzzle(cell, newPuzzle)
    } 
    resetGameState()
    chooseCell(cells[0])
    resetTimer()
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
    } else {
        cell.classList.add("changed")
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

    createPauseOverlay(board);
    createWinOverlay(board);
}

function createPauseOverlay(board) {
    const pauseOverlay = document.createElement("div");
    pauseOverlay.id = "pause-overlay";
    pauseOverlay.innerHTML = pauseIconBoard;
    pauseOverlay.addEventListener("click", () => {
        const timerBtn = document.getElementById("timer-button");
        toggleTimer(timerBtn);
    })
    board.appendChild(pauseOverlay);
}

function createWinOverlay(board) {
    const winOverlay = document.createElement("div");
    winOverlay.id = "win-overlay";
    const confettiImage = document.createElement("img");
    confettiImage.src = "./images/Confetti.svg";
    confettiImage.alt = "Confetti";
    winOverlay.appendChild(confettiImage);
    
    const winMessage = createWinMessage(winOverlay);
    winOverlay.appendChild(winMessage);
    board.appendChild(winOverlay);
}

function createWinMessage() {
    const winMessage = document.createElement("div");
    winMessage.id = "win-message";
    
    const winLabel = document.createElement("p");
    winLabel.id = "win-label";
    winLabel.textContent = "You Win!";
    winMessage.appendChild(winLabel);
    
    const winTimerLabel = document.createElement("p");
    winTimerLabel.id = "win-timer-label";
    winMessage.appendChild(winTimerLabel);

    return winMessage;
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
}

