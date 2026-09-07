export function createGrid(app) {
    const board = document.createElement("div");
    board.id = "sudoku-board";
    app.appendChild(board);

    for (let row=0; row<9; row++) {
        for (let column=0; column<9; column++) {
            const cell = document.createElement("div");
            cell.classList.add("board-cell");
            cell.id = row.toString() + column.toString();
            board.appendChild(cell);
        }
    }
}