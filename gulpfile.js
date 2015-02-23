var path = require('path');

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('less', function() {
  return gulp.src('./src/less/app.less')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [path.join(__dirname, 'vendors', 'bootstrap', 'less')]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/css'));
});

gulp.task('js', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', ['build'], function() {
  watch('./src/less/**/*.less', function() {
    gulp.start('less');
  });

  watch('./src/js/**/*.js', function() {
    gulp.start('js');
  });
});

gulp.task('build', ['less', 'js']);

gulp.task('default', ['build']);