angular.module('SudokuSolver')
  .controller('SudokuController', ['$scope', 'SudokuService',
    function ($scope, sudokuService) {

      $scope.puzzle = sudokuService.puzzle;
      $scope.originalPuzzle = angular.copy($scope.puzzle);

      $scope.solve = function () {
        console.time('Sudoku puzzle solved in')
        sudokuService.solve(0, 0);
        console.timeEnd('Sudoku puzzle solved in')
      };

    }]);