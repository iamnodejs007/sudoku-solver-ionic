/**
 * @class OptionsController
 */
angular.module('SudokuSolver')
    .controller('OptionsController', ['$scope', 'PuzzleFactory', 'OptionsService',
        function ($scope, puzzleFactory, optionsService) {

            /** 
             * @memberof OptionsController
             * @type puzzle[]
             * @description A list of all configured puzzles
             */
            $scope.puzzles = puzzleFactory;

            /** @function
             * @memberOf OptionsController
             * @description Enable or disable web workers. (Experiemental)
             * @param {boolean} - True to enable and false to disable
             */
            $scope.webWorkerToggleUpdate = function (enabled) {
                optionsService.toggleWebWorker(enabled);
            }

            /** @function
             * @memberOf OptionsController
             * @description Emits an event to indicate the puzzle selection has been changed.
             * The event data is the puzzle data structure.
             * @param {puzzleModel} - The puzzle to select
             */
            $scope.selectPuzzle = function (puzzle) {
                $scope.$emit('selectedPuzzleChanged', puzzle);
            };

        }]);