/**
 * The solver service is responsible for solving the sudoku puzzle.
 * @class OptionsService
 */
angular.module('SudokuSolver')
    .service('OptionsService', [function () {

        var webWorkerEnabled = false;

        /** @function
         * @memberOf OptionsService
         * @description Enable or disable web workers (experiemental)
         * @param {boolean} - True to enable and false to disable
         */
        this.toggleWebWorker = function (enabled) {
            webWorkerEnabled = enabled;
        };

        /** @function
         * @memberOf OptionsService
         * @description Determine if the app is using web workers
         * @returns {boolean} Flag to indicate if web workers are enabled
         */
        this.useWebWorker = function () {
            return webWorkerEnabled;
        };

    }]);