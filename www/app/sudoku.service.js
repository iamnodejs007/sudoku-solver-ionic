angular.module('SudokuSolver')
    .service('SudokuService', ['PuzzleConstant', 'IteratorsConstant',
        function (puzzle, iterators) {

            /**
             * The puzzle (updated by ref by the solve() function)
             */
            this.puzzle = puzzle;

            /**
             * Solve the puzzle
             * TODO - Port pure JS code here
             */
            this.solve = function () {
                // :-)
            }

        }]);
