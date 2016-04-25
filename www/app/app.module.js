angular.module('SudokuSolver', ['ionic'])
  .run(['$timeout', '$ionicPlatform',
    function ($timeout, $ionicPlatform) {
      $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        $timeout(function () {
          if (window.StatusBar) {
            window.StatusBar.styleHex('#FF0000');
          }
        }, 300);
      });
    }]);
