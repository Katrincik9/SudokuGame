class History {
    #history = []

    addValueToHistory(id, oldValue, newValue) {
        this.#history.push({
            cell: id,
            mode: "value",
            oldValue: oldValue,
            newValue: newValue,
        })
    }   

    addNotesToHistory(id, oldNotes, newNotes) {
        this.#history.push({
            cell: id,
            mode: "notes",
            oldNotes: oldNotes,
            newNotes: newNotes,
        })
    }

    pop() {
        const lastHistoryElement = this.#history.pop()
        return lastHistoryElement
    }

    getLastHistory() {
        const lastHistory = this.#history[this.#history.length-1];
        return lastHistory
    }

    clearHistory() {
        this.#history = []
    }
}

const history = new History()
export default history