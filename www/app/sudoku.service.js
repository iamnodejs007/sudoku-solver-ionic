angular.module('SudokuSolver')
    .service('SudokuService', ['PuzzleConstant', 'IteratorsConstant',
        function (puzzle, iterators) {

            /**
             * Debug flag to toggle additional logging
             */
            var debug = true;

            /**
             * Counter to track levels of recursion
             */
            var level = -1;

            /**
             * Expose the puzzle structure to the outside world
             * Can be used for binding the controller
             */
            this.puzzle = puzzle;

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
                    var val = puzzle[globalIndex];
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
                    if (puzzle[gridIndex] === 0) {
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
             * Display a text representation of the sudoku puzzle in the console
             */
            this.displayBoard = function () {
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
            this.solve = function (gridIndex) {

                if (debug) level++;

                // Iterate through the puzzle to find the next cell without a value
                var nextEmptyGridIndex = getIndexOfNextEmptyGridCell(gridIndex);

                // If no more empty cells, the puzzle has hopefully been solved
                // This is the base condition of the recursive call (navigate back up the call stack)
                if (!nextEmptyGridIndex) {
                    return true;
                }

                // Get all possible values that can go in the empty cell
                var candidates = getCandidatesForGridCell(nextEmptyGridIndex);

                // Fill in the next empty cell with one of the candidates and attempt to solve
                for (var i = 0; i < candidates.length; i++) {

                    // Insert a candidate into the empty cell
                    puzzle[nextEmptyGridIndex] = candidates[i];

                    // Debug
                    if (debug) {
                        var localLevel = level;
                        if (debug) console.log('Attempt candidate', candidates[i],
                            '- Grid index', gridIndex, '- Level =', level);
                        // this.displayBoard();
                    }

                    // Attempt to solve
                    if (this.solve(nextEmptyGridIndex)) {
                        return true;
                    }

                    // Debug
                    if (debug) {
                        console.log('Undo candidate', puzzle[nextEmptyGridIndex],
                            '- Grid index', gridIndex, '- Level', localLevel)
                    }

                    // Solve didn't work... undo the values we've tried                    
                    puzzle[nextEmptyGridIndex] = 0;
                }

                // Returning false outside the loop will backtrack
                // i.e.) none of the candidates worked out too well in the current (row,col) pairing
                return false;
            }

        }]);
