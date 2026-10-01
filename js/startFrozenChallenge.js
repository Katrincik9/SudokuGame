window.frozenChallenge = true; 

export function checkCellForFreeze() {
    const editableCells = shuffleArray([...document.querySelectorAll(".board-cell.changed")]);
    console.log(editableCells)

    for (const cell of editableCells) {
        const cellRow = cell.dataset.row;
        const cellColumn = cell.dataset.column;
        const cellBox = cell.dataset.box;

        const nrOfEditableCellsFromRow = document.querySelectorAll(`.board-cell.changed[data-row='${cellRow}']`).length - 1;
        const nrOfEditableCellsFromColumn = document.querySelectorAll(`.board-cell.changed[data-column='${cellColumn}']`).length - 1;
        const nrOfEditableCellsFromBox = document.querySelectorAll(`.board-cell.changed[data-box='${cellBox}']`).length - 1;

        const possibleTaskTypes = []

        const minRequiredCellsToFill = 2;
        let maxRequiredCellsToFill;

        if (nrOfEditableCellsFromRow >= minRequiredCellsToFill) {
            possibleTaskTypes.push("row")
        } 
        
        if (nrOfEditableCellsFromColumn >= minRequiredCellsToFill) {
            possibleTaskTypes.push("column")
        } 
        
        if (nrOfEditableCellsFromBox >= minRequiredCellsToFill) {
            possibleTaskTypes.push("box")
        }

        console.log(possibleTaskTypes)

        if (possibleTaskTypes.length === 0) {
            continue;
        } 

        const randomTaskType = possibleTaskTypes[Math.floor(Math.random() * possibleTaskTypes.length)];
        if (randomTaskType === "row") {
            maxRequiredCellsToFill = Math.min(4, nrOfEditableCellsFromRow)
        } else if (randomTaskType === "column") {
            maxRequiredCellsToFill = Math.min(4, nrOfEditableCellsFromColumn)
        } else if (randomTaskType === "box") {
            maxRequiredCellsToFill = Math.min(4, nrOfEditableCellsFromBox)
        }

        const requiredCellsToFill = Math.floor(Math.random() * (maxRequiredCellsToFill - minRequiredCellsToFill + 1) + minRequiredCellsToFill)
        console.log(requiredCellsToFill)

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
