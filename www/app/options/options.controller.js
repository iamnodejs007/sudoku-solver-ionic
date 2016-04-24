angular.module('SudokuSolver')
    .controller('OptionsController', ['$scope', 'PuzzleFactory', 'OptionsService',
        function ($scope, puzzleFactory, optionsService) {

            $scope.puzzles = puzzleFactory;

            $scope.webWorkerToggleUpdate = function (enabled) {
                optionsService.toggleWebWorker(enabled);
            }

            $scope.selectPuzzle = function (puzzle) {
                $scope.$emit('selectedPuzzleChanged', puzzle);
            };

        }]);