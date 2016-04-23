angular.module('SudokuSolver')
    .directive('myDirective', ['$window',
        function ($window) {
            return {
                link: function (s, e, a) {
                    function resize() {
                        var size = ($window.innerHeight > $window.innerWidth)
                            ? $window.innerWidth - 50
                            : $window.innerHeight - 230;
                        a.$set('style', 'width: ' + size + 'px; height: ' + size + 'px;');
                    }

                    resize();
                    angular.element($window).bind('resize', function () {
                        resize();
                    });
                }
            };
        }]);