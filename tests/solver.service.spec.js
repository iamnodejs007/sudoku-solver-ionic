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

    it('should contain an output method', function () {
        expect(solverService.displayBoard).toBeDefined();
    });

    it('should contain a puzzle property', function () {
        expect(solverService.puzzle).toBeDefined();
    });

    it("should throw error if not initialized", function () {
        expect(solverService.solve).toThrow(new Error());
    });

    it("should initialize and expose puzzle", function () {
        var fakePuzzle = [1, 2, 3, 4];
        solverService.initialize(fakePuzzle);
        expect(solverService.puzzle).toEqual(fakePuzzle);
    });

    xit("should throw error if puzzle is wrong size", function () {
        // TODO
    });

    xit("should throw error if puzzle has invalid format", function () {
        // TODO
    });

    xit("should throw error if puzzle not fully solved", function () {
        // TODO
    });

});