angular.module('SudokuSolver')
  .controller('SudokuController', ['$scope', '$timeout', '$ionicModal', 'SudokuService', 'PuzzleFactory', 'IteratorsConstant',
    function ($scope, $timeout, $ionicModal, sudokuService, puzzleFactory, iteratorsConst) {

      // Reference to the puzzle selection modal
      var modal;

      // Select the first puzzle by default
      $scope.puzzle = puzzleFactory[1];

      // Hook up solve button to the services solve method
      // Initialize the service with the puzzle to solve
      $scope.solve = function () {

        if (typeof (Worker) !== 'undefined') {
          var worker = new Worker('app/solver.worker.js');
          worker.addEventListener('message', function (e) {
            $timeout(function () {
              $scope.puzzle.data = e.data;
            });
          }, false);
          worker.postMessage({ puzzleData: $scope.puzzle.data, iterators: iteratorsConst });
        } else {
          console.time('Sudoku puzzle solved in');
          sudokuService.initialize($scope.puzzle.data);
          sudokuService.solve(0);
          console.timeEnd('Sudoku puzzle solved in');
        }

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