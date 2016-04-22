/**
 * Terminology:
 * 
 *   grid cell 
 *      - one cell within the puzzle 
 *      - represented by a grid index (0 <= gridIndex <= 80)
 * 
 *   row 
 *      - a series of 9 horizontal cells across the puzzle
 *      - represented by a row index (0 <= row <= 8)
 * 
 *   column 
 *      - a series of 9 vertical cells across the puzzle
 *      - represented by a column index (0 <= row <= 8)
 * 
 *   box
 *      - one of the 9 square regions that contains 9 grid cells
 *      - represented by a box index (0 <= box <= 8)
 */

var SudokuSolver = function (puzzle, iterators) {

    /**
     * Eliminate any value candidates from the current cell by examining the column
     * @param {int} row - Row index (0 <= row <= 8)
     * @param {int} col - Column index (0 <= col <= 8)
     * @param {int[]} candidates - List containing numbers 0 to 8 to test the cell against (pass by ref)
     */
    function narrowDownCandidatesAgainstCurrentColumn(row, col, candidates) {
        // Check if the column the current cell is in already contains the candidate
        iterators.columns[col].forEach(function (globalIndex) {
            var val = puzzle[globalIndex];
            if (val && candidates.indexOf(val) > -1) {
                candidates.splice(candidates.indexOf(val), 1);
            }
        });
    }

    /**
     * Eliminate any value candidates from the current cell by examining the row
     * @param {int} row - Row index (0 <= row <= 8)
     * @param {int} col - Column index (0 <= col <= 8)
     * @param {int[]} candidates - List containing numbers 0 to 8 to test the cell against (pass by ref)
     */
    function narrowDownCandidatesAgainstCurrentRow(row, col, candidates) {
        // Check if the row the current cell is in already contains the candidate
        iterators.rows[row].forEach(function (globalIndex) {
            var val = puzzle[globalIndex];
            if (val && candidates.indexOf(val) > -1) {
                candidates.splice(candidates.indexOf(val), 1);
            }
        });
    }

    /**
     * Eliminate any value candidates from the current cell by examining the box
     * @param {int} row - Row index (0 <= row <= 8)
     * @param {int} col - Column index (0 <= col <= 8)
     * @param {int[]} candidates - List containing numbers 0 to 8 to test the cell against (pass by ref)
     */
    function narrowDownCandidatesAgainstCurrentBox(row, col, candidates) {
        // Check if the box the current cell is in already contains the candidate
        iterators.boxes[Math.floor(col / 3) + (Math.floor(row / 3) * 3)].forEach(
            function (globalIndex) {
                var val = puzzle[globalIndex];
                if (val > 0 && candidates.indexOf(val) > -1) {
                    candidates.splice(candidates.indexOf(val), 1);
                }
            });
    }

    /**
     * Eliminate any value candidates from the current cell using the following methods:
     *  - narrowDownCandidatesAgainstCurrentRow(...)
     *  - narrowDownCandidatesAgainstCurrentColumn(...)
     *  - narrowDownCandidatesAgainstCurrentBox(...)
     * @param {int} row - Row index (0 <= row <= 8)
     * @param {int} col - Column index (0 <= col <= 8)
     */
    function getCandidatesForGridCell(row, col) {
        // All possible options... now attempt to narrow down the choices
        var candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        // Eliminate possibilites by examining existing values in same row, column, and box
        narrowDownCandidatesAgainstCurrentRow(row, col, candidates);
        narrowDownCandidatesAgainstCurrentColumn(row, col, candidates);
        narrowDownCandidatesAgainstCurrentBox(row, col, candidates);

        // Return the filtered candidates
        return candidates;
    }

    /**
     * Get the location of the next empty cell after the given grid index
     * @param {int} gridIndex - Grid index value where (0 <= gridIndex <= 80)
     * @returns {int} Grid index of the next empty cell after the provided grid index (null if none found)
     */
    function getLocationOfNextEmptyGridCell(gridIndex) {
        // Start at +1 so we don't iterate over the previous cell
        for (var i = gridIndex + 1; i < 81; i++) {
            if (puzzle[i] === 0) {
                var ret = {
                    row: getRowIndexFromGridIndex(i),
                    col: getColumnIndexFromGridIndex(i),
                    grid: i // TODO - use this instead of row and col indecies
                };
                // console.warn('empty find', row, col, ret);
                return ret;
            }
        }
        return null;
    };

    /**
     * Convert a grid index to a row index
     * i.e) Grid index 0-8 is in row index 1, 9-17 is in row index 2, etc..
     * @param {int} gridIndex - Index that represents a cell on the puzzle (0 <= i <= 81)
     * @return {int} Index that represents a column on the puzzle (0 <= i <= 8)
     */
    function getRowIndexFromGridIndex(gridIndex) {
        return Math.floor(gridIndex / 9);
    }

    /**
     * Convert a grid index to a column index
     * i.e) Grid index 0, 9, 18, 27, etc is in column index 0
     * @param {int} gridIndex - Index that represents a cell on the puzzle (0 <= i <= 81)
     * @return {int} Index that represents a column on the puzzle (0 <= i <= 8)
     */
    function getColumnIndexFromGridIndex(gridIndex) {
        var rowIndex = getRowIndexFromGridIndex(gridIndex);
        return gridIndex - (rowIndex * 9);
    }

    /**
     * Display a text representation of the sudoku puzzle
     */
    this.displayBoard = function() {
        var str = '';
        var j = 0;

        for (var i = 0; i < puzzle.length; i++) {
            if (j != 0 && j % 3 == 0) {
                str += ' | '
            }
            str += ' ' + (puzzle[i] ? puzzle[i] : ' ') + ' ';
            if (i == 27 || i == 54) {
                console.log('----------+-----------+----------')
            }
            if (j == 8) {
                console.log(str);
                str = '';
                j = 0;
            } else {
                j++
            }
        }
    }

    /**
     * Solve the puzzle
     *  - narrows down any possible candidates for empty cells
     *  - attempts each candidate until puzzle can be solved further
     *  - if puzzle cannot be solved with a chosen candidate, 
     *    rollback and try the next candidate
     * @param {int} rowIndex - Row index to start solving at
     * @param {int} colIndex - Column index to start solving at
     */
    this.solve = function (rowIndex, colIndex) {

        // Iterate through the puzzle to find the next cell without a value
        var gridIndex = colIndex + (rowIndex * 9);
        var nextEmptyGridCell = getLocationOfNextEmptyGridCell(gridIndex);

        // If no more empty cells, the puzzle has been solved (hopefully)
        // This is the base condition of the recursive call... return and navigate back up the call stack
        if (!nextEmptyGridCell) {
            return true;
        }

        // Get all possible values that can go in the empty cell
        var candidates = getCandidatesForGridCell(nextEmptyGridCell.row, nextEmptyGridCell.col); // +

        // Fill in the next empty cell with one of the candidates and attempt to solve
        for (var i = 0; i < candidates.length; i++) {

            // Insert a candidate into the empty cell
            var gridIndexForNewValue = nextEmptyGridCell.col + (nextEmptyGridCell.row * 9);
            puzzle[gridIndexForNewValue] = candidates[i];

            // Attempt to solve
            // TODO - use gridIndex as a param
            if (this.solve(nextEmptyGridCell.row, nextEmptyGridCell.col)) {
                return true;
            }

            // Solve didn't work... undo the values we've tried
            puzzle[gridIndexForNewValue] = 0;
        }

        // Returning false outside the loop will backtrack
        // i.e.) none of the candidates worked out too well in the current (row,col) pairing
        return false;
    }

};

(function () {

    var puzzle = require('./puzzles');
    var iterators = require('./iterators');

    console.log('\nInitial puzzle:')

    console.log('\nProcessing...');

    console.time('Took: ');
    var ss = new SudokuSolver(puzzle, iterators);
    ss.displayBoard();
    ss.solve(0, 0);

    console.log('\nResult:')
    ss.displayBoard();

    console.log('');
    console.timeEnd('Took: ');

    process.exit();

})();
