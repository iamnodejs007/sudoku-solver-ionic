angular.module('SudokuSolver')
    .directive('sudoku', ['$window',
        function ($window) {
            return {
                templateUrl: 'app/sudoku/sudoku.html',
                scope: {
                    puzzle: '='
                }
            };
        }]);