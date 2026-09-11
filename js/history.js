let history = []

export function addValueToHistory(id, oldValue, newValue) {
    history.push({
        cell: id,
        oldValue: oldValue,
        newValue: newValue,
    })
}

export function addNotesToHistory(id, oldNotes, newNotes) {
    history.push({
        cell: id,
        oldNotes: oldNotes,
        newNotes: newNotes,
    })
}

export function removeLastHistory() {
    let lastHistoryElement = history.pop()
    return lastHistoryElement
}