describe("OptionsController", function () {

    var ctrl, scope, optionsService;

    // Mock the cleanData function since undefined during tests
    angular.element.cleanData = function () { };

    // Include our module
    beforeEach(function () {
        module('SudokuSolver');
    });

    // Disable template caching in Ionic
    beforeEach(module(function ($provide, $urlRouterProvider) {
        $provide.value('$ionicTemplateCache', function () { });
        $urlRouterProvider.deferIntercept();
    }));

    beforeEach(function () {

        inject(function ($rootScope, $controller, _OptionsService_) {
            scope = $rootScope.$new();
            optionsService = _OptionsService_;

            ctrl = $controller('OptionsController', {
                $scope: scope,
                OptionsService: optionsService
            });
        });
    });

    it('should fire event after selecting puzzle', function () {
        spyOn(scope, '$emit');
        scope.selectPuzzle('test');
        expect(scope.$emit).toHaveBeenCalledWith('selectedPuzzleChanged', 'test');
    });

    it('should have web workers disabled by default', function () {
        expect(optionsService.useWebWorker()).toBe(false);
    });

    it('should update options service after enabling web workers', function () {
        scope.webWorkerToggleUpdate(true);
        expect(optionsService.useWebWorker()).toBe(true);
    });

    it('should update options service after disabling web workers', function () {
        scope.webWorkerToggleUpdate(false);
        expect(optionsService.useWebWorker()).toBe(false);
    });
});