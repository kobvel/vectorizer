var path = require('path');
var exec = require('child_process').exec;
var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');


var vendors = {
  css: [],
  js: [
    './vendors/jquery/dist/jquery.js',
    './vendors/konva/konva.js'
  ]
}

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

gulp.task('vendors', function() {
  return gulp.src(vendors.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('vendors.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js'));
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

  watch(vendors.js, function() {
    gulp.start('vendors');
  });
});

gulp.task('build', ['less', 'vendors', 'js']);

gulp.task('default', ['build']);

gulp.task('image', function(next) {
  var child = exec('cat *.js bad_file | wc -l',
    function(error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
});