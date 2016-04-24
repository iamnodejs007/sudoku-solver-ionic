angular.module('SudokuSolver')
    .directive('sudoku', ['$window',
        function ($window) {
            return {
                templateUrl: 'app/sudoku/sudoku.html',
                controllerAs: 'vm',
                scope: {
                    puzzle: '='
                },
                controller: ['$scope', function ($scope) {
                    $scope.originalPuzzle = angular.copy($scope.puzzle);
                }]
            };
        }]);