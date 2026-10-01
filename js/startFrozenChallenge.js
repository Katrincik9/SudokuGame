window.frozenChallenge = false; 

export function checkCellForFreeze() {
    const editableCells = shuffleArray([...document.querySelectorAll(".board-cell.changed")]);
    console.log(editableCells)

    for (const cell of editableCells) {
        const cellRow = cell.dataset.row;
        const cellColumn = cell.dataset.column;
        const cellBox = cell.dataset.box;

        const rowCells = document.querySelectorAll(`.board-cell.changed[data-row='${cellRow}']`)
        console.log(rowCells)
        const columnCells = document.querySelectorAll(`.board-cell.changed[data-column='${cellColumn}']`)
        console.log(columnCells)
        const boxCells = document.querySelectorAll(`.board-cell.changed[data-box='${cellBox}']`)
        console.log(boxCells)
        const taskType = []
        
        if (rowCells.length > 2) {
            taskType.push("row")
        } 
        
        if (columnCells.length > 2) {
            taskType.push("column")
        } 
        
        if (boxCells.length > 2) {
            taskType.push("box")
        }

        console.log(taskType)

        if (taskType.length === 0) {
            continue;
        } 

        const randomTaskType = taskType[Math.floor(Math.random() * taskType.length)];
        const filledCells = 0;
        console.log(randomTaskType);
        console.log(cell);
        cell.classList.add("frozen");
        const taskDescriptionLabel = document.createElement("label");
        taskDescriptionLabel.classList.add("task-label")
        taskDescriptionLabel.textContent = `Fill 2 cells in this cell's ${randomTaskType} to melt the ice. Progress: ${filledCells} / 2`;
        cell.append(taskDescriptionLabel);
        return;
    }
}

function shuffleArray(array) {
    for (let lastElement = array.length - 1; lastElement > 0; lastElement--) {
        const randomElement = Math.floor(Math.random() * (lastElement + 1));
        [array[lastElement], array[randomElement]] = [array[randomElement], array[lastElement]];
    }
    return array;
}
