angular.module('SudokuSolver')
    .directive('autoSize', ['$window', function ($window) {
        return {
            link: function (s, e, a) {

                var offsetForSolveButton = 200;
                var elementMargin = 40;

                /**
                 * Resize the element to fit within the window with a 1:1 aspect ratio.
                 */
                var resize = function () {

                    // Determine size first based on height.
                    // If width is truncated, make the innerWidth the limiting factor.
                    var size = $window.innerHeight - offsetForSolveButton;
                    if ($window.innerWidth < (size + elementMargin)) {
                        size = $window.innerWidth - elementMargin;
                    }

                    // Construct style string and apply to element
                    var styleString = 'width: ' + size + 'px; '
                        + 'height: ' + size + 'px; '
                        + 'top: ' + (($window.innerHeight / 2) - (size / 2) - (elementMargin * 1.5)) + 'px;'
                    a.$set('style', styleString);
                }

                // Invoke the resize initially and watch for window size changes
                resize();
                angular.element($window).bind('resize', function () {
                    resize();
                });

            }
        };
    }]);