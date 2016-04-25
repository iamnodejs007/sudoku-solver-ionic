var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var jasmine = require('gulp-jasmine');
var karma = require('karma');
var jsdoc = require('gulp-jsdoc3');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

/**
 * Compile sass and concatenate css
 */
gulp.task('sass', function (done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
});

/*
 * Run unit tests once
 */
gulp.task('unit-tests', function () {
  return new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: false,
    singleRun: true
  }).start();
});

/*
 * Run unit tests and watch for file changes
 */
gulp.task('unit-tests-watch', function () {
  return new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: true,
    singleRun: false
  }).start();
});

/**
 * Generate Markdown docs from JSDoc
 */
gulp.task('docs', function () {
  return gulp.src(['./README.md', "./www/app/**/*.js", '!./www/app/solver/solver.worker.js'])
    .pipe(jsdoc({
      "tags": {
        "allowUnknownTags": true
      },
      "source": {
        "excludePattern": "(^|\\/|\\\\)_"
      },
      "opts": {
        "destination": "./docs/gen"
      },
      "plugins": [
        // "plugins/markdown"
      ],
      "templates": {
        "cleverLinks": false,
        "monospaceLinks": false,
        "default": {
          "outputSourceFiles": false
        },
        "path": "ink-docstrap",
        "theme": "cerulean",
        "navType": "vertical",
        "linenums": true,
        "dateFormat": "MMMM Do YYYY, h:mm:ss a"
      }
    }))
})

/**
 * Install bower packages
 */
gulp.task('install', ['git-check'], function () {
  return bower.commands.install()
    .on('log', function (data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

/**
 * Check if git is installed
 */
gulp.task('git-check', function (done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
