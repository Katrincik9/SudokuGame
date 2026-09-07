const generatedPuzzle = window.sudoku.generate("hard");
const generatedPuzzleGrid = window.sudoku.board_string_to_grid(generatedPuzzle);

export default generatedPuzzleGrid
