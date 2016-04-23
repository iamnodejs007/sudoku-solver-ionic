angular.module('SudokuSolver')
  .controller('SudokuController', ['$scope', 'SudokuService', 'PuzzleFactory',
    function ($scope, sudokuService, puzzleFactory) {

      // Select the first puzzle by default
      $scope.puzzle = puzzleFactory[1].data;
      $scope.originalPuzzle = angular.copy($scope.puzzle);

      // Hook up solve button to the services solve method
      // Initialize the service with the puzzle to solve
      $scope.solve = function () {
        console.time('Sudoku puzzle solved in');
        sudokuService.initialize($scope.puzzle);
        sudokuService.solve(0, 0);
        console.timeEnd('Sudoku puzzle solved in');
      };

    }]);