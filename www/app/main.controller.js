angular.module('SudokuSolver')
  .controller('MainController', ['$scope', '$timeout', '$ionicModal', 'SolverService', 'PuzzleFactory', 'IteratorsConstant', 'OptionsService',
    function ($scope, $timeout, $ionicModal, solverService, puzzleFactory, iteratorsConst, optionsService) {

      /**
       * Select the first puzzle by default (deep copy) 
       */
      $scope.puzzle = angular.copy(puzzleFactory[0]);

      /**
       * Hook up solve button to the services solve method.
       * Initialize the service with the puzzle to solve.
       * Executed using a blocking angular service or a web worker.
       */
      $scope.solve = function () {
        // Use web workers
        if (typeof (Worker) !== 'undefined' && optionsService.useWebWorker()) {
          startWebWorkerSolver();
        }
        // Use the service (blocking calculation)
        else {
          console.time('Sudoku puzzle solved in');
          solverService.initialize($scope.puzzle.data);
          solverService.solve(0);
          console.timeEnd('Sudoku puzzle solved in');
        }
      };

      /**
       * Pops up a puzzle selection modal
       */
      $scope.selectPuzzle = function () {
        modal.show();
      };

      /**
       * Wire up to puzzle changes (deep copy)
       */
      $scope.$on('selectedPuzzleChanged', function (event, data) {
        $scope.puzzle = angular.copy(data);
      });

      /**
       * Wire up to puzzle changes (deep copy)
       */
      $scope.$on('$destroy', function () {
        modal.remove();
      });

      /**
       * Create the options modal isolate scope
       */
      var modal;
      var modalScope = $scope.$new(true);
      modalScope.cancel = function () {
        modal.hide();
      };

      /**
       * Create the options modal
       */
      $ionicModal.fromTemplateUrl('app/options.html', function ($ionicModal) {
        modal = $ionicModal;
      }, { scope: modalScope });

      /**
       * Get, start, and hook up web worker events
       */
      var startWebWorkerSolver = function () {
        // New worker from file
        var worker = new Worker('app/solver.worker.js');

        // Receive updates from worker and update puzzle binding
        worker.addEventListener('message', function (e) {
          $timeout(function () {
            $scope.puzzle.data = e.data;
          });
        }, false);

        // Tell the worker to start and give it the puzzle and iterators
        worker.postMessage({
          puzzleData: $scope.puzzle.data,
          iterators: iteratorsConst
        });
      };

    }]);
