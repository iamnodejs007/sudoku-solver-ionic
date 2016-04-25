/**
 * Utility class that validates a sudoku puzzle.
 * @class ValidatorService
 */
angular.module('SudokuSolver')
    .service('ValidatorService', ['IteratorsConstant',
        function (iterators) {

            /**
             * Scan the whole puzzle to check if values between 0 and 9
             */
            function areNumbersInRange(puzzle) {
                for (var i = 0; i < puzzle.length; i++) {
                    if (puzzle[i] < 0 || puzzle[i] > 9) {
                        return false;
                    }
                }
                return true;
            }

            /**
             * Check the tracker structure and see if a digit occurred more than once
             */
            function hasDuplicates(tracker) {
                for (var j = 0; j < 9; j++) {
                    if (tracker[j] > 1) {
                        return true;
                    }
                }
                return false;
            };

            /**
             * @function
             * @memberOf ValidatorService
             * @description Determines if the puzzle has a valid format
             * i.e. no duplicate numbers in any row, column, or box any values are in range
             * @param {int[]} - The sudoku puzzles contents
             * @returns {boolean} - True if puzzle has a valid format
             */
            this.validate = function (puzzle) {

                if (!areNumbersInRange(puzzle)) {
                    return false;
                }

                // Check for any duplicates in rows, columns, or boxes by counting
                // the occurence of each value
                var tracker = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
                var localTracker;
                for (var i = 0; i < 9; i++) {

                    localTracker = angular.copy(tracker);
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

        }]);
