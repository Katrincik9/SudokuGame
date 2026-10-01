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

        const minRequiredCellsToFill = 2;
        const maxRequiredCellsToFill = 4;
        const requiredCellsToFill = Math.floor(Math.random() * (maxRequiredCellsToFill - minRequiredCellsToFill) + minRequiredCellsToFill + 1)
        console.log(requiredCellsToFill)

        if (rowCells.length > requiredCellsToFill) {
            taskType.push("row")
        } 
        
        if (columnCells.length > requiredCellsToFill) {
            taskType.push("column")
        } 
        
        if (boxCells.length > requiredCellsToFill) {
            taskType.push("box")
        }

        console.log(taskType)

        if (taskType.length === 0) {
            continue;
        } 
        
        const randomTaskType = taskType[Math.floor(Math.random() * taskType.length)];
        cell.dataset.taskType = randomTaskType;
        cell.dataset.taskRegionNumber = cell.dataset[randomTaskType];
        cell.dataset.taskRequiredCells = requiredCellsToFill;
        console.log(randomTaskType);
        console.log(cell);
        cell.classList.add("frozen");
        const taskDescriptionLabel = document.createElement("label");
        taskDescriptionLabel.classList.add("task-label")
        taskDescriptionLabel.textContent = `Fill ${requiredCellsToFill} cells in this cell's ${randomTaskType} to melt the ice. Progress: 0 / ${requiredCellsToFill}`;
        cell.append(taskDescriptionLabel);
        
        return;
    }
}

export function checkProgress() {
    const frozenCell = document.querySelector(".board-cell.frozen");
    if (!frozenCell) return;
    
    const targetRegionCells = [...document.querySelectorAll(`.board-cell.changed[data-${frozenCell.dataset.taskType}='${frozenCell.dataset.taskRegionNumber}']`)];
    const validFilledCells = targetRegionCells.filter(cell => 
        cell.querySelector(".cell-value").textContent !== "" && !cell.classList.contains("conflict")
    );

    const frozenCellTaskLabel = document.querySelector(".board-cell.frozen .task-label");
    frozenCellTaskLabel.textContent = `Fill ${frozenCell.dataset.taskRequiredCells} cells in this 
        cell's ${frozenCell.dataset.taskType} to melt the ice. 
        Progress: ${validFilledCells.length} / ${frozenCell.dataset.taskRequiredCells}`;

    if (validFilledCells.length >= Number(frozenCell.dataset.taskRequiredCells)) {
        frozenCell.classList.remove("frozen");
    }
}

function shuffleArray(array) {
    for (let lastElement = array.length - 1; lastElement > 0; lastElement--) {
        const randomElement = Math.floor(Math.random() * (lastElement + 1));
        [array[lastElement], array[randomElement]] = [array[randomElement], array[lastElement]];
    }
    return array;
}
