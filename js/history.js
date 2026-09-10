let history = []

export function addValueToHistory(id, oldValue, newValue) {
    history.push({
        cell: id,
        oldValue: oldValue,
        newValue: newValue,
    })
    console.log(history)
}

export function addNotesToHistory(id, oldNotes, newNotes) {
    history.push({
        cell: id,
        oldNotes: oldNotes,
        newNotes: newNotes,
    })
    console.log(history)
}