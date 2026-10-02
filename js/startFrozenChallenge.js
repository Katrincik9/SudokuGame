window.frozenChallenge = false; 

const minRequiredCellsToFill = 2;

export function checkCellForFreeze() {
    const editableCells = shuffleArray([...document.querySelectorAll(".board-cell.changed")]);

    for (const cell of editableCells) {
        const possibleTaskTypes = getPossibleTaskTypes(cell)
        
        if (possibleTaskTypes.length === 0) {
            continue;
        } 

        const randomTaskType = possibleTaskTypes[Math.floor(Math.random() * possibleTaskTypes.length)];
        const requiredCellsToFill = getRequiredCellsToFill(cell, randomTaskType);
        
        initializeFrozenCell(cell, randomTaskType, requiredCellsToFill)
        
        return;
    }
}

function initializeFrozenCell(cell, taskType, requiredCells) {
    cell.classList.add("frozen");
    cell.dataset.taskType = taskType;
    cell.dataset.taskRequiredCells = requiredCells;

    const taskLabel = document.createElement("label");
    taskLabel.classList.add("task-label")
    taskLabel.textContent = `Fill ${requiredCells} cells in this cell's ${taskType} to melt the ice. Progress: 0 / ${requiredCells}`;
    cell.append(taskLabel);
}

function getNrOfAvailableCellsPerRegion(cell, regionType) {
    const regionNumber = cell.dataset[regionType];
    const availableCells = document.querySelectorAll(`.board-cell.changed[data-${regionType}='${regionNumber}']`);
    const nrOfAvailableCells = availableCells.length - 1;

    return nrOfAvailableCells
}

function getPossibleTaskTypes(cell) {
    const nrOfEditableCellsFromRow = getNrOfAvailableCellsPerRegion(cell, "row");
    const nrOfEditableCellsFromColumn = getNrOfAvailableCellsPerRegion(cell, "column");
    const nrOfEditableCellsFromBox = getNrOfAvailableCellsPerRegion(cell, "box");
    const possibleTaskTypes = [];

    if (nrOfEditableCellsFromRow >= minRequiredCellsToFill) {
        possibleTaskTypes.push("row")
    } 
    
    if (nrOfEditableCellsFromColumn >= minRequiredCellsToFill) {
        possibleTaskTypes.push("column")
    } 
    
    if (nrOfEditableCellsFromBox >= minRequiredCellsToFill) {
        possibleTaskTypes.push("box")
    }

    return possibleTaskTypes;
}

function getRequiredCellsToFill(cell, taskType) {
    const availableCells = getNrOfAvailableCellsPerRegion(cell, taskType);
    const maxRequiredCellsToFill = Math.min(4, availableCells);
    const requiredCellsToFill = Math.floor(Math.random() * (maxRequiredCellsToFill - minRequiredCellsToFill + 1) + minRequiredCellsToFill)
    return requiredCellsToFill
}

export function checkProgress() {
    const frozenCell = document.querySelector(".board-cell.frozen");
    if (!frozenCell) return;
    
    const taskRegion = frozenCell.dataset.taskType;
    const nrOfRequiredCells = Number(frozenCell.dataset.taskRequiredCells)
    const targetRegionCells = [...document.querySelectorAll(`.board-cell.changed[data-${taskRegion}='${frozenCell.dataset[taskRegion]}']`)];
    const validFilledCells = targetRegionCells.filter(cell => 
        cell.querySelector(".cell-value").textContent !== "" && !cell.classList.contains("conflict")
    );
    const currentProgress = validFilledCells.length;
    const frozenCellTaskLabel = document.querySelector(".board-cell.frozen .task-label");

    updateTaskLabel(frozenCellTaskLabel, taskRegion, nrOfRequiredCells, currentProgress)

    if (validFilledCells.length >= nrOfRequiredCells) {
        frozenCell.classList.remove("frozen");
        frozenCellTaskLabel.remove();
    }
}

function updateTaskLabel(frozenCellTaskLabel, taskRegion, nrOfRequiredCells, currentProgress) {
    frozenCellTaskLabel.textContent = `Fill ${nrOfRequiredCells} cells in this 
        cell's ${taskRegion} to melt the ice. 
        Progress: ${currentProgress} / ${nrOfRequiredCells}`;
}

function shuffleArray(array) {
    for (let lastElement = array.length - 1; lastElement > 0; lastElement--) {
        const randomElement = Math.floor(Math.random() * (lastElement + 1));
        [array[lastElement], array[randomElement]] = [array[randomElement], array[lastElement]];
    }
    return array;
}
