# Sudoku Solver

An hybrid-mobile app that solves sudoku puzzles.

## Install dependencies

`npm install -g cordova ionic gulp karma`

In the project folder, run:

`npm install && bower install`

## Run the app

To view the app in a web browser:

`ionic serve`

A browser should start and display the app. If not, navigate to http://localhost:8001.

To run on an iOS emulator:

`ionic platform add ios`
`ionic emulate ios`

Wait for the emulator to open.


## Run the unit tests

`gulp unit-tests`

## View the API docs

Documentation is automatically generated from JSDoc comments throughout the code. To view the docs, open `./docs/gen/index.html`. Note the 'Classes' drodpown in the menu bar.

## Using the app

By default, a puzzle is loaded into the main view. Tap the 'Solve' button to solve the puzzle. To switch between puzzles, hit the settings icon in the top right, and tap a puzzle.

> The "Experimental" section is exactly that... experimental :). Enabling "Slow Motion" will use a Web Worker instead of the angular service to solve the puzzle. There are spin-loops in the Web Worker to allow for incremental UI updates to visualize the solution as it is formed. Not recommended for use on an actual mobile phone (desktop browser only)

## Loading your own puzzle

To load your own puzzle to solve, open up `./www/app/common/puzzle.factory.js`. You can add a data structure in the following format to the array of puzzles:

```
{
    name: 'My Test Puzzle',
    date: [] // array of 81 elements (0 represents an empty cell)
}
```

## Screenshots