/** 
 * EXPERIMENTAL
 * 
 * The code here is copied from the solver.service.js angular service.
 * My goal was to experiment with Web Workers to try and update the UI
 * in real-time as the puzzle was being solved. There are some spin loops
 * to simulate a delay between iterations and backtracking.
 * */

self.addEventListener('message', function (e) {

    var progressFunc = function () {
        self.postMessage(s.puzzle);
    };

    var s = new Solver(e.data.iterators, progressFunc);
    s.initialize(e.data.puzzleData);
    s.solve(0);

    progressFunc();

}, false);

var Solver = function (iterators, progressCallback) {

    var _this = this;

    /**
     * Debug flag to toggle additional logging
     */
    var debug = false;

    /**
     * Counter to track levels of recursion
     */
    var level = -1;

    /**
     * Expose the puzzle structure to the outside world
     * Can be used for binding the controller
     */
    this.puzzle = null;

    /**
     * Eliminate any value candidates from the current cell if:
     *  - the value exists in the current row
     *  - the value exists in the current column
     *  - the value exists in the current box
     * @param {int} row - Row index (0 <= row <= 8)
     * @param {int} col - Column index (0 <= col <= 8)
     */
    function getCandidatesForGridCell(gridIndex) {

        // Figure out what row an column we are in
        var row = getRowIndexFromGridIndex(gridIndex);
        var col = getColumnIndexFromGridIndex(gridIndex);

        // All possible options... now attempt to narrow down the choices
        var candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        var eliminationFunc = function (globalIndex) {
            var val = _this.puzzle[globalIndex];
            if (val && candidates.indexOf(val) > -1) {
                candidates.splice(candidates.indexOf(val), 1);
            }
        };

        // Eliminate possibilites by examining existing values in same row, column, and box
        iterators.rows[row].forEach(eliminationFunc)
        iterators.columns[col].forEach(eliminationFunc);
        iterators.boxes[Math.floor(col / 3) + (Math.floor(row / 3) * 3)].forEach(eliminationFunc)

        // Return the filtered candidates
        return candidates;
    }

    /**
     * Get the location of the next empty cell after the given grid index
     * @param {int} gridIndex - Grid index value where (0 <= gridIndex <= 80)
     * @returns {int} Grid index of the next empty cell after the provided grid index (null if none found)
     */
    function getIndexOfNextEmptyGridCell(startingGridIndex) {
        // Start at +1 so we don't iterate over the previous cell
        for (var gridIndex = startingGridIndex + 1; gridIndex < 81; gridIndex++) {
            if (_this.puzzle[gridIndex] === 0) {
                return gridIndex;
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
     * Initialize the solver with a puzzle.
     * @param {int[]} puzzle - An array of 81 integers representing a sudoku puzzle.
     *                         `0` represents an empty or unsolved cell
     */
    this.initialize = function (puzzle) {
        _this.puzzle = puzzle;
    };

    /**
     * Solve the puzzle
     *  - narrows down any possible candidates for empty cells
     *  - attempts each candidate until puzzle can be solved further
     *  - if puzzle cannot be solved with a chosen candidate, 
     *    rollback and try the next candidate
     * @param {int} rowIndex - Row index to start solving at
     * @param {int} colIndex - Column index to start solving at
     */
    this.solve = function (gridIndex) {

        // Check if initialized
        if (!_this.puzzle) {
            throw 'Please call initialize(...) with the puzzle data before solving.';
        }

        // Short delay
        var a = 0; for (var i = 0; i < 500000000; i++) a++;

        // Update with progress every 20 iterations.  && gridIndex % 20 == 0
        // Doing an update every iteration lags the app pretty badly.
        if (progressCallback) {
            progressCallback();
        }

        if (!gridIndex) {
            gridIndex = 0;
        }

        if (debug) level++;

        // Iterate through the puzzle to find the next cell without a value
        var nextEmptyGridIndex = getIndexOfNextEmptyGridCell(gridIndex);

        // If no more empty cells, the puzzle has hopefully been solved.
        // This is the base condition of the recursive call (navigate back up the call stack).
        if (!nextEmptyGridIndex) {
            return true;
        }

        // Get all possible values that can go in the empty cell
        var candidates = getCandidatesForGridCell(nextEmptyGridIndex);

        // Fill in the next empty cell with one of the candidates and attempt to solve
        for (var i = 0; i < candidates.length; i++) {

            // Insert a candidate into the empty cell
            _this.puzzle[nextEmptyGridIndex] = candidates[i];

            // Debug
            if (debug) {
                var localLevel = level;
                if (debug) console.log('Level', level, '- Grid index', nextEmptyGridIndex,
                    '- Attempt candidate', candidates[i], 'from list', candidates);
            }

            // Attempt to solve
            var t = this.solve(nextEmptyGridIndex);
            if (t) {
                return t;
            }

            // Debug
            if (debug) {
                console.log('Level', localLevel, '- Grid index', nextEmptyGridIndex,
                    '- Undo candidate', _this.puzzle[nextEmptyGridIndex])
            }

            // Solve didn't work... undo the values we've tried  
            _this.puzzle[nextEmptyGridIndex] = 0;
        }

        // Returning false outside the loop will backtrack
        // i.e.) none of the candidates worked out too well in the current (row,col) pairing
        return false;
    }

};