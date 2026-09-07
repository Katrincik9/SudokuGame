export let selectedCell = null;

export function chooseCell(cell) {
    if (selectedCell !== null) {
        selectedCell.classList.remove("selected");
    } 

    selectedCell = cell;
    selectedCell.classList.add("selected");
}