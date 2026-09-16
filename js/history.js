class History {
    #history = []

    addCellDataToHistory(id, oldData, newData) {
        this.#history.push({
            cell: id,
            oldData: oldData,
            newData: newData,
        })
    }

    pop() {
        return this.#history.pop()
    }

    clearHistory() {
        this.#history = []
    }
}

const history = new History()
export default history