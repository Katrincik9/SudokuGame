import { chooseCell } from "./changeCell.js";

const generatedPuzzle = window.sudoku.generate("hard");
const generatedPuzzleGrid = window.sudoku.board_string_to_grid(generatedPuzzle);

export function createGrid(app) {
    const board = document.createElement("div");
    board.id = "sudoku-board";
    board.addEventListener("click", (event) => chooseCell(event.target))
    app.appendChild(board);

    for (let row=0; row<9; row++) {
        for (let column=0; column<9; column++) {
            const cell = document.createElement("div");
            cell.classList.add("board-cell");
            cell.id = row.toString() + column.toString();
            if (generatedPuzzleGrid[row][column] !== ".") {
                cell.innerText = generatedPuzzleGrid[row][column];
                cell.classList.add("fixed");
            }
            board.appendChild(cell);
        }
    }
}
