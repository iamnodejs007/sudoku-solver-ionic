angular.module('SudokuSolver')
  .controller('SudokuController', ['$scope',
    function ($scope) {

      $scope.puzzle = [];
      for (var i = 0; i < 81; i++) $scope.puzzle.push(i);

    }]);