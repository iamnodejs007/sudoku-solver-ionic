angular.module('SudokuSolver')
  .controller('SudokuController', ['$scope', '$ionicModal', 'SudokuService', 'PuzzleFactory',
    function ($scope, $ionicModal, sudokuService, puzzleFactory) {

      // Reference to the puzzle selection modal
      var modal;

      // Select the first puzzle by default
      $scope.puzzle = puzzleFactory[1];

      // Hook up solve button to the services solve method
      // Initialize the service with the puzzle to solve
      $scope.solve = function () {
        console.time('Sudoku puzzle solved in');
        sudokuService.initialize($scope.puzzle.data);
        sudokuService.solve(0);
        console.timeEnd('Sudoku puzzle solved in');
      };

      // Pops up a puzzle selection modal
      $scope.selectPuzzle = function () {
        modal.show();
      };

      // Cleanup
      $scope.$on('$destroy', function () {
        modal.remove();
      });

      // Create the puzzle selection modals isolate scope
      var modalScope = $scope.$new(true);
      modalScope.puzzles = puzzleFactory;
      modalScope.cancel = function () {
        modal.hide();
      };
      modalScope.selectPuzzle = function (puzzle) {
        $scope.puzzle = puzzle;
        modal.hide();
      };

      // Create the puzzle selection modal
      $ionicModal.fromTemplateUrl('app/puzzle-selection.html',
        function ($ionicModal) {
          modal = $ionicModal;
        }, {
          scope: modalScope
        });
    }]);