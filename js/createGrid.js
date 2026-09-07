import generatedPuzzleGrid from "./board.js"

export function createGrid(app) {
    const board = document.createElement("div");
    board.id = "sudoku-board";
    app.appendChild(board);

    for (let row=0; row<9; row++) {
        for (let column=0; column<9; column++) {
            const cell = document.createElement("div");
            cell.classList.add("board-cell");
            cell.id = row.toString() + column.toString();
            if (generatedPuzzleGrid[row][column] !== ".") {
                cell.innerText = generatedPuzzleGrid[row][column];
            }
            board.appendChild(cell);
        }
    }
}