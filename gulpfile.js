const gulp = require('gulp');
const jscs = require('gulp-jscs');

gulp.task('default', () =>
  gulp.src('./**/*.js')
  .pipe(jscs())
  .pipe(jscs.reporter())
);
