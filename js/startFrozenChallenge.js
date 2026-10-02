window.frozenChallenge = true; 

const minRequiredCellsToFill = 2;

export function checkCellForFreeze() {
    const editableCells = shuffleArray([...document.querySelectorAll(".board-cell.changed")]);
    let frozenCells = 0;

    for (const cell of editableCells) {
        const possibleTaskTypes = getPossibleTaskTypes(cell)
        if (possibleTaskTypes.length === 0) {
            continue;
        } 
        if (breakExistingFrozenTasks(cell)) continue;

        const randomTaskType = possibleTaskTypes[Math.floor(Math.random() * possibleTaskTypes.length)];
        const requiredCellsToFill = getRequiredCellsToFill(cell, randomTaskType);
        initializeFrozenCell(cell, randomTaskType, requiredCellsToFill)
        frozenCells++; 

        if (frozenCells === 3) return;
    }
}

function breakExistingFrozenTasks(possibleFrozenCell) {
    const frozenCells = document.querySelectorAll(".board-cell.frozen")
    for (const frozenCell of frozenCells) {
        const frozenCellTaskType = frozenCell.dataset.taskType
        const frozenCellRegionNr = frozenCell.dataset[frozenCellTaskType]
        const frozenCellRequiredCells = Number(frozenCell.dataset.taskRequiredCells)
    
        if (possibleFrozenCell.dataset[frozenCellTaskType] === frozenCellRegionNr) {
            const nrOfAvailableCells = getNrOfAvailableCellsPerRegion(possibleFrozenCell, frozenCellTaskType)
            if (nrOfAvailableCells < frozenCellRequiredCells) return true
        }
    }
    return false
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
    const availableCells = [...document.querySelectorAll(`.board-cell.changed[data-${regionType}='${regionNumber}']`)].filter(cell => !cell.classList.contains("frozen"));
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
    const frozenCells = document.querySelectorAll(".board-cell.frozen");
    
    for (const frozenCell of frozenCells) {
        const taskRegion = frozenCell.dataset.taskType;
        const nrOfRequiredCells = Number(frozenCell.dataset.taskRequiredCells)
        const targetRegionCells = [...document.querySelectorAll(`.board-cell.changed[data-${taskRegion}='${frozenCell.dataset[taskRegion]}']`)];
        const validFilledCells = targetRegionCells.filter(cell => 
            cell.querySelector(".cell-value").textContent !== "" && !cell.classList.contains("conflict")
        );
        const currentProgress = validFilledCells.length;
        const frozenCellTaskLabel = frozenCell.querySelector(".task-label");

        updateTaskLabel(frozenCellTaskLabel, taskRegion, nrOfRequiredCells, currentProgress)

        if (currentProgress >= nrOfRequiredCells) {
            frozenCell.classList.remove("frozen");
            frozenCellTaskLabel.remove();
            delete frozenCell.dataset.taskType
            delete frozenCell.dataset.taskRequiredCells
        }
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
