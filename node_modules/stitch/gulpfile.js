var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var map = require('map-stream');

var jsFiles = [
	'gulpfile.js',
	'src/**/*.js',
	'tests/**/*.js'
];
var exitCode = 0;
var exitOnJshintError = map(function (file, cb) {
    if (!file.jshint.success) {
        exitCode = 1;
    }
    cb();
});

process.on('exit', function () {
    process.exit(exitCode);
});
function Lint() {
    return gulp.src(jsFiles)
        .pipe(jshint({
            evil: true
        }))
        .pipe(jshint.reporter('jshint-stylish'));
}
function Test(reporter) {
    return gulp.src('tests/**/*.js')
        .pipe(mocha({reporter: reporter}))
        .on('error', function() {
            exitCode = 1;
        });
}

////////////////
// User tasks //
////////////////
gulp.task('default', ['lint', 'test', 'watch']);

gulp.task('lint', Lint);

gulp.task('test', ['lint'], Test.bind(this, 'spec'));

gulp.task('tdd', ['lint'], Test.bind(this, 'dot'));

gulp.task('clearConsole', function() {
    process.stdout.write('\u001B[2J\u001B[0;0f');
});

gulp.task("watch", ['clearConsole'], function() {
    return gulp.watch(jsFiles, ['clearConsole', 'lint', 'tdd']);
});

//////////////
// CI tasks //
//////////////
gulp.task('ciLint', function() {
    return Lint().pipe(exitOnJshintError);
});

gulp.task('ciTest', ['ciLint'], Test.bind(this, 'spec'));

gulp.task('ci', ['ciLint', 'ciTest']);