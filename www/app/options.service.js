angular.module('SudokuSolver')
    .service('OptionsService', [function () {

        var webWorkerEnabled = false;

        this.toggleWebWorker = function (enabled) {
            webWorkerEnabled = enabled;
        };

        this.useWebWorker = function () {
            return webWorkerEnabled;
        };

    }]);