angular.module('SudokuSolver')
    .controller('OptionsController', ['$scope', 'PuzzleFactory',
        function ($scope, puzzleFactory) {

            $scope.puzzles = puzzleFactory;

            $scope.useWebWorkers = true;

            $scope.selectPuzzle = function (puzzle) {
                $scope.$emit('selectedPuzzleChanged', puzzle);
            };

        }]);