let history = []

export function addValueToHistory(id, oldValue, newValue) {
    history.push({
        cell: id,
        mode: "value",
        oldValue: oldValue,
        newValue: newValue,
    })
}

export function addNotesToHistory(id, oldNotes, newNotes) {
    history.push({
        cell: id,
        mode: "notes",
        oldNotes: oldNotes,
        newNotes: newNotes,
    })
}

export function removeLastHistory() {
    const lastHistoryElement = history.pop()
    return lastHistoryElement
}

export function getLastHistory() {
    const lastHistory = history[history.length-1];
    return lastHistory
}

export function clearHistory() {
    history = []
}