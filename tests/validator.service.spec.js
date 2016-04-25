describe('ValidatorService', function () {

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
    var validatorService;
    beforeEach(inject(function (_ValidatorService_) {
        validatorService = _ValidatorService_;
    }));

    it('should contain a validate method', function () {
        expect(validatorService.validate).toBeDefined();
    });

    it('should fail validation if puzzle is wrong size', function () {
        var puzzle = [0, 1, 2, 3];
        expect(validatorService.validate(puzzle)).toBe(false);
    });

    it('should fail validation if puzzle is null', function () {
        expect(validatorService.validate(null)).toBe(false);
    });

    it('should fail validation if puzzle is undefined', function () {
        var puzzle;
        expect(validatorService.validate(puzzle)).toBe(false);
    });

    it('should fail validation if puzzle has invalid row format', function () {
        var puzzle = [];
        for (var i = 0; i < 81; i++) {
            puzzle.push(0);
        }
        puzzle[0] = 1;
        puzzle[8] = 1;
        expect(validatorService.validate(puzzle)).toBe(false);
    });

    it('should fail validation if puzzle has invalid box format', function () {
        var puzzle = [];
        for (var i = 0; i < 81; i++) {
            puzzle.push(0);
        }
        puzzle[0] = 1;
        puzzle[10] = 1;
        expect(validatorService.validate(puzzle)).toBe(false);
    });


    it('should fail validation if puzzle has invalid column format', function () {
        var puzzle = [];
        for (var i = 0; i < 81; i++) {
            puzzle.push(0);
        }
        puzzle[0] = 1;
        puzzle[9] = 1;
        expect(validatorService.validate(puzzle)).toBe(false);
    });

    it('should validate the default puzzle', function () {
        var puzzle = [8, 5, 6, 0, 1, 4, 7, 3, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 2,
            4, 0, 0, 0, 0, 1, 6, 0, 0, 6, 2, 0, 5, 9, 3, 0, 0, 0, 3, 1, 8, 0,
            2, 4, 5, 0, 0, 0, 5, 3, 4, 0, 9, 2, 0, 0, 2, 4, 0, 0, 0, 0, 7, 3,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 8, 6, 3, 0, 2, 9, 4];

        expect(validatorService.validate(puzzle)).toBe(true);
    });

});