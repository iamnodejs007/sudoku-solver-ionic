/**
 * Main interaction logic for the UI
 * @class MainController
 */
angular.module('SudokuSolver')
  .controller('MainController', ['$scope', '$timeout', '$ionicModal', '$ionicPopup', 'SolverService', 'Puzzles', 'IteratorsConstant', 'OptionsService',
    function ($scope, $timeout, $ionicModal, $ionicPopup, solverService, puzzles, iteratorsConst, optionsService) {

      /** 
       * @memberof MainController
       * @type puzzle
       * @description The puzzle data structure for binding to in the view
       */
      $scope.puzzle = angular.copy(puzzles[0]);

      /** 
       * @function
       * @memberof MainController
       * @description Hook up solve button to the services solve method.
       * Initialize the service with the puzzle to solve.
       * Executed using a blocking angular service or a web worker.
       */
      $scope.solve = function () {
        // Experimental (this if-statement should really be hidden in the SolverService)
        if (typeof (Worker) !== 'undefined' && optionsService.useWebWorker()) {
          startWebWorkerSolver();
        }
        // Initialize the solver with the selected puzzle and solve
        else {
          try {
            console.time('Sudoku puzzle solved in');
            solverService.initialize($scope.puzzle.data);
            solverService.solve();
            console.timeEnd('Sudoku puzzle solved in');
          } catch (e) {
            $ionicPopup.alert({ title: 'Oh no!', template: e.message, okType: 'button-balanced' });
          }
        }
      };

      /** 
       * @function
       * @memberof MainController
       * @description Pops up a puzzle selection modal
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
      $ionicModal.fromTemplateUrl('app/options/options.html', function ($ionicModal) {
        modal = $ionicModal;
      }, { scope: modalScope });

      /**
       * Get, start, and hook up web worker events
       */
      var startWebWorkerSolver = function () {
        // New worker from file
        var worker = new Worker('app/experimental/solver.worker.js');

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
