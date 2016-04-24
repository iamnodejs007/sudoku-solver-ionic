angular.module('SudokuSolver')
    .directive('autoSize', function () {
        return {
            link: function (s, e, a) {
                // Resize the element to fit within the window with a 1:1 aspect ratio.
                // TODO - Vertically center with offeset for the solve button
                // resize = function () {
                //     var size = ($window.innerHeight > $window.innerWidth)
                //         ? $window.innerWidth - 50
                //         : $window.innerHeight - 230;
                //     a.$set('style', 'width: ' + size + 'px; height: ' + size + 'px;');
                // }

                // resize();
                // angular.element($window).bind('resize', function () {
                //     resize();
                // });
            }
        };
    });