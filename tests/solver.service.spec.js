describe("SolverService", function () {

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

    // Get the SolverService
    var solverService;
    beforeEach(inject(function (_SolverService_) {
        solverService = _SolverService_;
    }));

    it('should contain a solve method', function () {
        expect(solverService.solve).toBeDefined();
    });

    it('should contain an initialize method', function () {
        expect(solverService.initialize).toBeDefined();
    });

    it('should contain a puzzle property', function () {
        expect(solverService.puzzle).toBeDefined();
    });

    it('should throw error if not initialized', function () {
        expect(solverService.solve).toThrow();
    });

    it('should solve the sample puzzle', function () {
        var unsolved = [8, 5, 6, 0, 1, 4, 7, 3, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 2,
            4, 0, 0, 0, 0, 1, 6, 0, 0, 6, 2, 0, 5, 9, 3, 0, 0, 0, 3, 1, 8, 0,
            2, 4, 5, 0, 0, 0, 5, 3, 4, 0, 9, 2, 0, 0, 2, 4, 0, 0, 0, 0, 7, 3,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 8, 6, 3, 0, 2, 9, 4];

        var solved = [8, 5, 6, 2, 1, 4, 7, 3, 9, 1, 9, 3, 5, 7, 6, 8, 4, 2, 2,
            4, 7, 9, 8, 3, 1, 6, 5, 4, 6, 2, 7, 5, 9, 3, 8, 1, 9, 3, 1, 8, 6,
            2, 4, 5, 7, 7, 8, 5, 3, 4, 1, 9, 2, 6, 6, 2, 4, 1, 9, 8, 5, 7, 3,
            3, 7, 9, 4, 2, 5, 6, 1, 8, 5, 1, 8, 6, 3, 7, 2, 9, 4];

        solverService.initialize(unsolved);
        solverService.solve();
        expect(solverService.puzzle).toEqual(solved);
    });

});