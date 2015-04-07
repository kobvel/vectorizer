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
  css: ['./vendors/animated-checkboxes/css/component.css',
    './vendors/animated-checkboxes/css/normalize.css',
    './vendors/animated-border-menus/css/icons.css',
    './vendors/animated-border-menus/css/style2.css'
  ],
  js: [
    './vendors/jquery/dist/jquery.js',
    './vendors/angular/angular.js',
    './vendors/angular-bootstrap/ui-bootstrap-tpls.js',
    './vendors/animated-checkboxes/js/svgcheckbx.js',
    './vendors/konva/konva.js',
    './vendors/seiyria-bootstrap-slider/js/bootstrap-slider.js',
    './vendors/angular-bootstrap-slider/slider.js',
    './vendors/animated-border-menus/js/classie.js',
    './vendors/animated-border-menus/js/borderMenu.js',
    './vendors/color-thief/src/color-thief.js'
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
  return gulp.src(['./src/js/app.js', './src/js/{controllers,directives,services}/*.js'])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
    //.pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/js'));
});

gulp.task('views', function() {
  return gulp.src('./src/**/*.html')
    .pipe(plumber())
    .pipe(gulp.dest('./public/'));
});

gulp.task('watch', ['build'], function() {
  watch('./src/less/**/*.less', function() {
    gulp.start('less');
  });

  watch('./src/js/**/*.js', function() {
    gulp.start('js');
  });

  watch('./src/views/**/*.html', function() {
    gulp.start('views');
  });

  watch(vendors.js, function() {
    gulp.start('vendors');
  });
});

gulp.task('build', ['less', 'vendors', 'js', 'views']);

gulp.task('default', ['build']);