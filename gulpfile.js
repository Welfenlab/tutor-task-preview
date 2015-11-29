var browserify, coffee, del, gulp, rename, source;

gulp = require('gulp');
source = require('vinyl-source-stream');
browserify = require('browserify');

gulp.task('bundle', function() {
  return browserify('./index.js', {
    debug: false,
    transform: ['brfs']
  })
  .bundle()
  .pipe(source('index.browserified.js'))
  .pipe(gulp.dest('./'));
});
gulp.task('default', ['bundle']);
