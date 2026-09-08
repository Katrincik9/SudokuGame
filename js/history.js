let history = []

export function addToHistory(id, oldValue, newValue) {
    history.push({
        cell: id,
        oldValue: oldValue,
        newValue: newValue
    })
    console.log(history)
}