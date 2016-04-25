/**
 * The solver service is responsible for solving the sudoku puzzle.
 * @class SolverService
 */
angular.module('SudokuSolver')
    .service('SolverService', ['IteratorsConstant',
        function (iterators) {

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
             * @memberOf SolverService
             * @type puzzle
             * @description The puzzle data structure. Can be used for binding a controller
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
             * Determines if the puzzle has a valid format
             * i.e. no duplicate numbers in any row, column, or box any values are in range
             * @param {int[]} - The sudoku puzzle structure
             * @returns {boolean} - True if puzzle has a valid format
             */
            function isPuzzleValid(puzzle) {

                // Intial scan of whole puzzle to check if values between 0 and 9
                for (var i = 0; i < _this.puzzle.length; i++) {
                    if (puzzle[i] < 0 || puzzle[i] > 9) {
                        return false;
                    }
                }

                // Check the tracker structure and see if a digit occurred more than once
                var hasDuplicates = function (localTracker) {
                    for (var j = 0; j < 9; j++) {
                        if (localTracker[j] > 1) {
                            return true;
                        }
                    }
                    return false;
                };

                // Check for any duplicates in rows, columns, or boxes by counting
                // the occurence of each value
                var tracker = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
                for (var i = 0; i < 9; i++) {

                    var localTracker = angular.copy(tracker);
                    iterators.rows[i].forEach(function (r) {
                        localTracker[puzzle[r]]++;
                    });
                    if (hasDuplicates(localTracker)) {
                        return false;
                    }

                    localTracker = angular.copy(tracker);
                    iterators.columns[i].forEach(function (c) {
                        localTracker[puzzle[c]]++;
                    });
                    if (hasDuplicates(localTracker)) {
                        return false;
                    }

                    localTracker = angular.copy(tracker);
                    iterators.boxes[i].forEach(function (b) {
                        localTracker[puzzle[b]]++;
                    });
                    if (hasDuplicates(localTracker)) {
                        return false;
                    }
                }

                return true;
            };

            /** @function
             * @memberOf SolverService
             * @description Initialize the solver with a puzzle.
             * @param {int[]} puzzle - An array of 81 integers representing a sudoku puzzle. 0 represents an empty or unsolved cell
             * @throw Throws an error is the puzzle is not a valid format
             */
            this.initialize = function (puzzle) {
                _this.puzzle = puzzle;

                if (!isPuzzleValid(puzzle)) {
                    throw new Error('It looks like that puzzle isn\'t valid');
                }
            };

            /** @function
             * @memberOf SolverService
             * @description Solve the puzzle
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
                    throw new Error('Please initialize the solver with a puzzle');
                }

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

        }]);
