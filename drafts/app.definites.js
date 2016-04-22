var SudokuSolver = function (puzzle) {

    /**
     * Determines if a given number exists in a 9 cell wide row within the grid.
     * @param {int} value - The value (1 <= value <= 9) to check for uniqueness in the row
     * @param {int} rowIndex - The row number (0 <= rowIndex <= 8) to check for uniqueness in
     */
    function existsInRow(value, rowIndex) {

        if (rowIndex < 0 || rowIndex >= 9) {
            throw 'Row number out of range (' + rowIndex + '). Must be 0 <= r < 9';
        }

        // console.log('\nexistsInRow');

        var startIndex = rowIndex * 9;
        var limit = startIndex + 9;
        var increment = 1;
        for (var i = startIndex; i < limit; i = i + increment) {
            // console.log(' puzzle[' + i + '] = ' + puzzle[i]);
            if (puzzle[i] === value) {
                return true;
            }
        }

        return false;
    }

    /**
     * Determines if a given number exists in a 9 cell high column within the grid.
     * @param {int} value - The value (1 <= value <= 9)  to check for uniqueness in the column
     * @param {int} columnIndex - The column number (0 <= columnIndex <= 8) to check for uniqueness in
     */
    function existsInColumn(value, columnIndex) {

        if (columnIndex < 0 || columnIndex >= 9) {
            throw 'Column number out of range (' + columnIndex + '). Must be 0 <= n < 9';
        }

        // console.log('\nexistsInColumn');

        var startIndex = columnIndex;
        var limit = 9 * 9;
        var increment = 9;
        for (var i = startIndex; i < limit; i = i + increment) {
            // console.log(' puzzle[' + i + '] = ' + puzzle[i]);
            if (puzzle[i] === value) {
                return true;
            }
        }

        return false;
    }

    /**
     * Given a square number, returns the start index in the grid of the first cell in the square.
     * @param {int} squareIndex - The index of one of the 9 squares in the grid (0 <= squareIndex <= 8)
     * @returns {int} - Start index in the grid of the frist cell in the square
     */
    function getStartIndexOfSquare(squareIndex) {
        if (squareIndex >= 0 && squareIndex < 3) {
            return squareIndex * 3;
        } else if (squareIndex >= 3 && squareIndex < 6) {
            return (squareIndex * 3) + 18;
        } else if (squareIndex >= 6 && squareIndex < 9) {
            return (squareIndex * 3) + 36;
        } else {
            throw 'Square number out of range (' + squareIndex + ').  Must be 0 <= n < 9'
        }
    }

    /**
     * Determines if a given number exists in a 3x3 square within the grid.
     * @param {int} value - The value (1 <= x <= 9)  to check for uniqueness in the square
     * @param {int} squareIndex - The square number (0 <= x <= 8) to check for uniqueness in
     * @returns
     */
    function existsInSquare(value, squareIndex) {

        // console.log('\nexistsInSquare:', arguments);

        var startIndex = getStartIndexOfSquare(squareIndex);
        var exists = false;
        for (var i = startIndex; i < startIndex + 21; i++) {
            // console.log(' puzzle[' + i + '] = ', puzzle[i]);

            if (puzzle[i] === value) {
                exists = true;
                break;
            }

            // If the current indexes diff from the original by 2, 11, or 20,
            // we are at the end of the squares row. Increment by 6 ( = 9 - 3) 
            // to jump to the squares next row.
            if ((i - startIndex) === 2
                || (i - startIndex) === 11
                || (i - startIndex === 20)) {
                i += 6;
            }
        }
        return exists;
    }

    function getEmptyGridIndexesInSquare(squareIndex) {
        var emptyIndexes = [];
        var startIndex = getStartIndexOfSquare(squareIndex);
        for (var i = startIndex; i < startIndex + 21; i++) {
            if (puzzle[i] === 0) {
                emptyIndexes.push(i);
            }
            if ((i - startIndex) === 2
                || (i - startIndex) === 11
                || (i - startIndex === 20)) {
                i += 6;
            }
        }
        return emptyIndexes;
    }

    function getRowIndexFromGridIndex(gridIndex) {
        return Math.floor(gridIndex / 9);
    }

    function getColumnIndexFromGridIndex(gridIndex) {
        var rowIndex = getRowIndexFromGridIndex(gridIndex);
        return gridIndex - (rowIndex * 9);
    }

    function outputPuzzle() {
        var str = '';
        var j = 0;

        // Grid
        for (var i = 0; i < puzzle.length; i++) {
            if (j != 0 && j % 3 == 0) {
                str += ' | '
            }
            str += ' ' + (puzzle[i] ? puzzle[i] : ' ') + ' ';
            if (i == 27 || i == 54) {
                console.log('----------+-----------+----------')
            }
            if (j == 8) {
                console.log(str);
                str = '';
                j = 0;
            } else {
                j++
            }
        }

        // CSV
        // for (var i = 0; i < puzzle.length; i++) {
        //     str += (puzzle[i] ? puzzle[i] : '') + ',';

        //     if ((i + 1) % 9 === 0) {
        //         console.log(str);
        //         str = '';
        //     }
        // }
    }

    function narrowCellsValueCanBePlacedIn(value, squareIndex, emptyIndexesInSquare) {

        console.log('narrowCellsValueCanBePlacedIn - START', value, squareIndex, emptyIndexesInSquare);

        // Clone the array so we don't index into the original after elements have been removed
        var emptyIndexesInSquareOriginal = emptyIndexesInSquare.slice();

        for (var i = 0; i < emptyIndexesInSquareOriginal.length; i++) {

            var ci = getColumnIndexFromGridIndex(emptyIndexesInSquareOriginal[i]);
            var _existsInColumn = existsInColumn(value, ci);

            var ri = getRowIndexFromGridIndex(emptyIndexesInSquareOriginal[i]);
            var _existsInRow = existsInRow(value, ri);

            if (_existsInColumn || _existsInRow) {
                emptyIndexesInSquare.splice(
                    emptyIndexesInSquare.indexOf(emptyIndexesInSquareOriginal[i]), 1);
            }

            console.log(' grid index:', emptyIndexesInSquareOriginal[i],
                ' - value:', value,
                ' - exists in col', ci, ':', _existsInColumn,
                ' - exists in row:', ri, ':', _existsInRow);
        }

        console.log('narrowCellsValueCanBePlacedIn - END', value, squareIndex, emptyIndexesInSquare, '\n');

        if (emptyIndexesInSquare.length === 1) {
            console.log('   found a spot :)')
        }
    }

    this.solve = function () {

        console.log('Solving...');

        if (puzzle.length != (9 * 9)) {
            console.error('Incorrect puzzle format');
        }

        // Main execution loop
        try {

            var lastSum = 0;

            for (; ;) {

                // Start it up
                for (var sq = 0; sq < 9; sq++) { // For each square

                    // For each allowed number in a square
                    console.log('\nSquare', sq, '\n----------');
                    for (var val = 1; val <= 9; val++) {

                        var _existsInSquare = existsInSquare(val, sq);
                        // console.log('sq:', sq, ' - val:', val, ' - exists:', _existsInSquare);
                        if (!_existsInSquare) {
                            console.log('Square', sq, 'needs a', val);

                            var _emptyGridCellsInSquare = getEmptyGridIndexesInSquare(sq);
                            narrowCellsValueCanBePlacedIn(val, sq, _emptyGridCellsInSquare);
                            if (_emptyGridCellsInSquare.length === 1) {
                                // Great! We've found a cell to place the value in
                                puzzle[_emptyGridCellsInSquare[0]] = val;
                            }
                        }
                    }
                }

                // Dump to console
                outputPuzzle();

                // SUM tells us if we are complete the puzzle. 
                // TODO: use count of emptyGridIndexes
                var sum = puzzle.reduce(function add(a, b) {
                    return a + b;
                }, 0);
                console.log(sum, sum == 405);
                if (sum === 405) {
                    console.log('Done!');
                    break;
                }
                if (lastSum === sum) {
                    console.warn('Definites solved... Stopping with incomplete puzzle.');
                    break;
                }
                lastSum = sum;
            }
            console.log('\nFinished execution.')
        } catch (e) {
            console.error('Error occurred while solving the puzzle:', e);
        }
    }
};

// Puzzle definition
// `0` represents an empty cell
var puzzleOld = [
    4, 0, 3, 0, 0, 0, 0, 0, 0,
    9, 0, 0, 4, 0, 2, 6, 0, 0,
    0, 5, 6, 7, 0, 0, 0, 0, 8,

    0, 1, 5, 6, 7, 0, 0, 4, 3,
    0, 0, 0, 3, 0, 0, 0, 0, 0,
    3, 6, 0, 2, 0, 1, 5, 0, 7,

    0, 0, 2, 1, 8, 0, 0, 6, 0,
    0, 0, 0, 0, 0, 0, 1, 5, 0,
    0, 9, 0, 5, 0, 0, 3, 0, 4
];

var puzzle = [
    8, 5, 6, 0, 1, 4, 7, 3, 0,
    0, 9, 0, 0, 0, 0, 0, 0, 0,
    2, 4, 0, 0, 0, 0, 1, 6, 0,

    0, 6, 2, 0, 5, 9, 3, 0, 0,
    0, 3, 1, 8, 0, 2, 4, 5, 0,
    0, 0, 5, 3, 4, 0, 9, 2, 0,

    0, 2, 4, 0, 0, 0, 0, 7, 3,
    0, 0, 0, 0, 0, 0, 0, 1, 0,
    0, 1, 8, 6, 3, 0, 2, 9, 4
]

var ss = new SudokuSolver(puzzle);
ss.solve();

process.exit();
